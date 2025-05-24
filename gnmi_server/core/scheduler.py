from apscheduler.schedulers.background import BackgroundScheduler

from core.jobs.gnmi_server_auth import token_update_job

scheduler = BackgroundScheduler()

scheduler.add_job(token_update_job, "interval", minutes=30)