from datetime import datetime, timedelta

def calculate_next_communication(last_date, periodicity):
    """
    Calculate the next communication date based on the last date and periodicity.
    """
    weeks = int(periodicity.replace(" weeks", "").strip())
    return last_date + timedelta(weeks=weeks)

def format_date(date):
    """
    Format a Python datetime object to a string (e.g., "2024-12-28").
    """
    return date.strftime("%Y-%m-%d")
