from app.models import Company, CommunicationMethod, CommunicationLog
from app import db
from flask import Blueprint, request, jsonify, Response
import csv
from io import StringIO
from flask_cors import CORS


reporting = Blueprint('reporting', __name__)


@reporting.route('/reports/communication-frequency', methods=['GET'])
def communication_frequency():
    start_date = request.args.get('startDate')
    end_date = request.args.get('endDate')
    company_id = request.args.get('companyId')

    query = db.session.query(
        CommunicationMethod.name,
        db.func.count(CommunicationLog.id)
    ).join(CommunicationLog.method)

    if company_id:
        query = query.filter(CommunicationLog.company_id == company_id)
    if start_date:
        query = query.filter(CommunicationLog.date >= start_date)
    if end_date:
        query = query.filter(CommunicationLog.date <= end_date)

    query = query.group_by(CommunicationMethod.name)
    results = query.all()

    methods = [row[0] for row in results]
    frequencies = [row[1] for row in results]

    return jsonify({"methods": methods, "frequencies": frequencies})

@reporting.route('/reports/activity-log', methods=['GET'])
def activity_log():
    # Get optional filters
    start_date = request.args.get('startDate')
    end_date = request.args.get('endDate')
    company_id = request.args.get('companyId')

    # Base query with proper chaining
    query = (
        db.session.query(
            CommunicationLog.date,
            Company.name.label('company'),
            CommunicationMethod.name.label('method'),
            CommunicationLog.notes
        )
        .join(Company, CommunicationLog.company_id == Company.id)  # Join with Company
        .join(CommunicationMethod, CommunicationLog.method_id == CommunicationMethod.id)  # Join with CommunicationMethod
    )

    # Apply filters
    if start_date:
        query = query.filter(CommunicationLog.date >= start_date)
    if end_date:
        query = query.filter(CommunicationLog.date <= end_date)
    if company_id:
        query = query.filter(CommunicationLog.company_id == company_id)

    # Order by date
    query = query.order_by(CommunicationLog.date.desc())

    # Execute query
    logs = query.all()

    # Format results
    result = [
        {
            "date": log.date.strftime('%Y-%m-%d %H:%M:%S'),
            "company": log.company,
            "method": log.method,
            "notes": log.notes
        }
        for log in logs
    ]

    return jsonify(result)

import csv
from flask import Response, request
from io import StringIO
from fpdf import FPDF  # Library for PDF generation

@reporting.route('/reports/activity-log/export', methods=['GET'])
def export_activity_log():
    export_format = request.args.get('format', 'csv')  # Format: 'csv' or 'pdf'

    logs = db.session.query(
        CommunicationLog.date,
        Company.name.label('company'),
        CommunicationMethod.name.label('method'),
        CommunicationLog.notes
    ).join(Company, CommunicationLog.company_id == Company.id).join(
        CommunicationMethod, CommunicationLog.method_id == CommunicationMethod.id
    ).order_by(CommunicationLog.date.desc()).all()

    if export_format == 'csv':
        # Generate CSV
        si = StringIO()
        writer = csv.writer(si)
        writer.writerow(['Date', 'Company', 'Method', 'Notes'])  # CSV Header
        for log in logs:
            writer.writerow([
                log.date.strftime('%Y-%m-%d %H:%M:%S'),
                log.company,
                log.method,
                log.notes
            ])
        output = si.getvalue()
        si.close()
        response = Response(output, mimetype='text/csv')
        response.headers['Content-Disposition'] = 'attachment; filename=activity_log.csv'
        return response

    elif export_format == 'pdf':
            # Generate PDF
            pdf = FPDF()
            pdf.add_page()
            pdf.set_font('Arial', size=12)
            pdf.cell(200, 10, txt='Activity Log', ln=True, align='C')

            # Add table headers
            pdf.set_font('Arial', size=10, style='B')
            headers = ['Date', 'Company', 'Method', 'Notes']
            widths = [40, 50, 50, 50]  # Column widths

            for i in range(len(headers)):
                pdf.cell(widths[i], 10, headers[i], border=1, align='C')
            pdf.ln()

            # Add table rows
            pdf.set_font('Arial', size=10)
            for log in logs:
                # Get the height required for wrapping Notes text
                note_lines = pdf.multi_cell(widths[3], 10, log.notes, border=0, split_only=True)
                row_height = max(len(note_lines) * 10, 10)  # Determine row height

                # Draw cells for the row
                pdf.cell(widths[0], row_height, log.date.strftime('%Y-%m-%d'), border=1)
                pdf.cell(widths[1], row_height, log.company, border=1)
                pdf.cell(widths[2], row_height, log.method, border=1)

                # Draw the Notes column with wrapped text
                x, y = pdf.get_x(), pdf.get_y()  # Current position
                pdf.multi_cell(widths[3], 10, log.notes, border=1)
                pdf.set_xy(x + widths[3], y)  # Move to the next row

                pdf.ln(row_height)

            # Return PDF as response
            response = Response(pdf.output(dest='S').encode('latin1'), mimetype='application/pdf')
            response.headers['Content-Disposition'] = 'attachment; filename=activity_log.pdf'
            return response

    return jsonify({"error": "Invalid format specified"}), 400

@reporting.route('/reports/engagement-effectiveness', methods=['GET'])
def engagement_effectiveness():
    query = db.session.query(
        CommunicationMethod.name,
        db.func.count(CommunicationLog.id)
    ).join(CommunicationLog.method).group_by(CommunicationMethod.name)

    results = query.all()

    methods = [row[0] for row in results]
    effectiveness = [row[1] for row in results]  # Placeholder for metrics

    return jsonify({"methods": methods, "effectiveness": effectiveness})

@reporting.route('/reports/overdue-trends', methods=['GET'])
def overdue_trends():
    # Query the overdue communication logs grouped by date
    overdue_logs = db.session.query(
        db.func.date(CommunicationLog.date),  # This extracts the date part
        db.func.count(CommunicationLog.id)   # Count of overdue communications
    ).filter(
        CommunicationLog.date < db.func.now()  # Communications with dates in the past
    ).group_by(db.func.date(CommunicationLog.date)).all()

    # Convert the results to JSON-friendly format
    dates = [str(row[0]) for row in overdue_logs]  # Convert date to string if needed
    overdue_counts = [row[1] for row in overdue_logs]

    return jsonify({"dates": dates, "overdue_counts": overdue_counts})

@reporting.route('/reports/export', methods=['GET'])
def export_report():
    report_type = request.args.get('type', 'frequency')

    si = StringIO()
    writer = csv.writer(si)

    if report_type == 'frequency':
        query = db.session.query(
            CommunicationMethod.name,
            db.func.count(CommunicationLog.id)
        ).join(CommunicationLog.method).group_by(CommunicationMethod.name).all()

        writer.writerow(['Method', 'Frequency'])
        for row in query:
            writer.writerow(row)

    elif report_type == 'activity-log':
        logs = db.session.query(
            CommunicationLog.date,
            Company.name.label('company'),
            CommunicationMethod.name.label('method'),
            CommunicationLog.notes
        ).join(CommunicationLog.company).join(CommunicationLog.method).order_by(CommunicationLog.date.desc()).all()

        writer.writerow(['Date', 'Company', 'Method', 'Notes'])
        for log in logs:
            writer.writerow([log.date.strftime('%Y-%m-%d'), log.company, log.method, log.notes])

    response = Response(si.getvalue(), mimetype='text/csv')
    response.headers['Content-Disposition'] = f'attachment; filename={report_type}_report.csv'
    return response
