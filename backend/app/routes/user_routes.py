from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
from ..models import db, Company, CommunicationLog, CommunicationMethod

user_routes = Blueprint('user', __name__)

# Helper function to parse communication_periodicity
def parse_communication_periodicity(communication_periodicity):
    try:
        # Try to parse the communication_periodicity
        return int(communication_periodicity.replace(" weeks", "").replace(" Weeks", "").strip())
    except (ValueError, AttributeError):
        # If an error occurs or the value is None, return a default value
        print(f"Invalid communication_periodicity value: {communication_periodicity}")
        return 2  # Default to 2 weeks if there's an issue

# Fetch User Dashboard Data
@user_routes.route('/dashboard', methods=['GET'])
def get_dashboard():
    companies = Company.query.all()
    dashboard_data = []
    for company in companies:
        # Fetch last five communications for the company
        last_five = CommunicationLog.query.filter_by(company_id=company.id).order_by(CommunicationLog.date.desc()).limit(5).all()

        # Fetch next scheduled communication using the helper function
        periodicity = parse_communication_periodicity(company.communication_periodicity)
        last_communication_date = last_five[0].date if last_five else None
        next_scheduled_date = (last_communication_date + timedelta(weeks=periodicity)) if last_communication_date else None

        # Determine highlights (Red = overdue, Yellow = due today)
        highlight = None
        if next_scheduled_date:
            today = datetime.today().date()
            if next_scheduled_date < today:
                highlight = "red"
            elif next_scheduled_date == today:
                highlight = "yellow"

        dashboard_data.append({
            "company_name": company.name,
            "last_five_communications": [{"type": log.method_id, "date": log.date.strftime("%d %b %Y")} for log in last_five],
            "next_scheduled_communication": next_scheduled_date.strftime("%d %b %Y") if next_scheduled_date else "Not Scheduled",
            "highlight": highlight
        })

    return jsonify(dashboard_data)

# Log Communication Action
@user_routes.route('/log-communication', methods=['POST'])
def log_communication():
    data = request.json
    new_log = CommunicationLog(
        company_id=data['company_id'],
        method_id=data['method_id'],
        date=datetime.strptime(data['date'], "%Y-%m-%d"),
        notes=data.get('notes')
    )
    db.session.add(new_log)
    db.session.commit()
    return jsonify({"message": "Communication logged successfully!"}), 201

# Notifications (Overdue and Today's Communications)
@user_routes.route('/notifications', methods=['GET'])
def get_notifications():
    companies = Company.query.all()
    overdue = []
    today = []

    for company in companies:
        # Determine next scheduled communication using the helper function
        periodicity = parse_communication_periodicity(company.communication_periodicity)
        last_log = CommunicationLog.query.filter_by(company_id=company.id).order_by(CommunicationLog.date.desc()).first()
        last_date = last_log.date if last_log else None
        next_scheduled_date = (last_date + timedelta(weeks=periodicity)) if last_date else None

        if next_scheduled_date:
            today_date = datetime.today().date()
            if next_scheduled_date < today_date:
                overdue.append({"company_name": company.name, "next_communication": next_scheduled_date.strftime("%d %b %Y")})
            elif next_scheduled_date == today_date:
                today.append({"company_name": company.name, "next_communication": next_scheduled_date.strftime("%d %b %Y")})

    return jsonify({
        "overdue": overdue,
        "today": today
    })

@user_routes.route('/companies', methods=['GET'])
def get_companies():
    companies = Company.query.all()
    result = [{"id": company.id, "name": company.name} for company in companies]
    return jsonify(result)

# Calendar Data
@user_routes.route('/calendar', methods=['GET'])
def get_calendar():
    logs = CommunicationLog.query.all()
    calendar_data = []
    for log in logs:
        company = Company.query.get(log.company_id)
        method = CommunicationMethod.query.get(log.method_id)
        calendar_data.append({
            "id": log.id,
            "company_name": company.name,
            "method": method.name,
            "date": log.date.strftime("%Y-%m-%d"),
            "notes": log.notes
        })
    return jsonify(calendar_data)

# Reporting Data
@user_routes.route('/reports/frequency', methods=['GET'])
def communication_frequency():
    methods = CommunicationMethod.query.all()
    report = []
    for method in methods:
        count = CommunicationLog.query.filter_by(method_id=method.id).count()
        report.append({"method": method.name, "count": count})
    return jsonify(report)

@user_routes.route('/reports/overdue-trends', methods=['GET'])
def overdue_trends():
    overdue_counts = {}
    today = datetime.today().date()
    logs = CommunicationLog.query.all()

    for log in logs:
        company = Company.query.get(log.company_id)
        periodicity = parse_communication_periodicity(company.communication_periodicity)
        next_date = log.date + timedelta(weeks=periodicity)
        if next_date < today:
            month = next_date.strftime("%Y-%m")
            overdue_counts[month] = overdue_counts.get(month, 0) + 1

    trends = [{"month": key, "overdue_count": value} for key, value in sorted(overdue_counts.items())]
    return jsonify(trends)
