from app import create_app, db  # Adjust the import based on your app structure
from app.models import Company

# Create an application context to allow database interaction
app = create_app()  # Assuming you have a factory function to create your Flask app
with app.app_context():  # This creates the application context
    # Query companies with invalid communication_periodicity
    invalid_companies = Company.query.filter(Company.communication_periodicity.notlike('%week%')).all()

    # Loop through the companies and fix invalid values
    for company in invalid_companies:
        print(f"Invalid periodicity for company {company.name}: {company.communication_periodicity}")
        company.communication_periodicity = '2 weeks'  # Or set to None if you prefer
        db.session.commit()  # Save changes to the database

    print("Invalid values cleaned up.")
