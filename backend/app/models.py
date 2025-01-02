from app import db
import re

class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100))
    linkedin_profile = db.Column(db.String(255))
    emails = db.Column(db.String(255))
    phone_numbers = db.Column(db.String(255))
    comments = db.Column(db.Text)
    communication_periodicity = db.Column(db.String(50))  # e.g., "2 weeks"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.communication_periodicity:
            self.validate_communication_periodicity()

    def validate_communication_periodicity(self):
        # Check if the communication_periodicity is a valid format like '2 weeks'
        if not re.match(r'^\d+ weeks$', self.communication_periodicity):
            # If invalid, set it to the default value
            self.communication_periodicity = '2 weeks'  # Default value


class CommunicationMethod(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255))
    sequence = db.Column(db.Integer)  # Order in which the methods are used
    mandatory = db.Column(db.Boolean, default=False)

class CommunicationLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'))
    method_id = db.Column(db.Integer, db.ForeignKey('communication_method.id'))
    date = db.Column(db.Date, nullable=False)
    notes = db.Column(db.Text)

    company = db.relationship('Company', backref=db.backref('communications', lazy=True))
    method = db.relationship('CommunicationMethod', backref=db.backref('logs', lazy=True))
