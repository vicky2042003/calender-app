from flask import Blueprint, jsonify, request
from ..models import db, Company, CommunicationMethod

admin_routes = Blueprint('admin', __name__)

@admin_routes.route('/companies', methods=['GET', 'POST', 'PUT', 'DELETE'])
def manage_companies():
    if request.method == 'GET':
        companies = Company.query.all()
        return jsonify([{
            "id": company.id,
            "name": company.name,
            "location": company.location,
            "linkedin_profile": company.linkedin_profile,
            "emails": company.emails,
            "phone_numbers": company.phone_numbers,
            "comments": company.comments,
            "communication_periodicity": company.communication_periodicity
        } for company in companies])

    elif request.method == 'POST':
        data = request.json
        new_company = Company(
            name=data['name'],
            location=data.get('location'),
            linkedin_profile=data.get('linkedin_profile'),
            emails=data.get('emails'),
            phone_numbers=data.get('phone_numbers'),
            comments=data.get('comments'),
            communication_periodicity=data.get('communication_periodicity')
        )
        db.session.add(new_company)
        db.session.commit()
        return jsonify({"message": "Company added successfully!"}), 201

    elif request.method == 'PUT':
        data = request.json
        company = Company.query.get(data['id'])
        if not company:
            return jsonify({"error": "Company not found"}), 404
        company.name = data['name']
        company.location = data.get('location')
        company.linkedin_profile = data.get('linkedin_profile')
        company.emails = data.get('emails')
        company.phone_numbers = data.get('phone_numbers')
        company.comments = data.get('comments')
        company.communication_periodicity = data.get('communication_periodicity')
        db.session.commit()
        return jsonify({"message": "Company updated successfully!"})

    elif request.method == 'DELETE':
        data = request.json
        company = Company.query.get(data['id'])
        if not company:
            return jsonify({"error": "Company not found"}), 404
        db.session.delete(company)
        db.session.commit()
        return jsonify({"message": "Company deleted successfully!"})

@admin_routes.route('/communication-methods', methods=['GET', 'POST'])
def manage_communication_methods():
    if request.method == 'GET':
        methods = CommunicationMethod.query.all()
        return jsonify([{
            "id": method.id,
            "name": method.name,
            "description": method.description,
            "sequence": method.sequence,
            "mandatory": method.mandatory
        } for method in methods])

    elif request.method == 'POST':
        data = request.json
        new_method = CommunicationMethod(
            name=data['name'],
            description=data.get('description'),
            sequence=data.get('sequence'),
            mandatory=data.get('mandatory', False)
        )
        db.session.add(new_method)
        db.session.commit()
        return jsonify({"message": "Communication method added successfully!"}), 201
