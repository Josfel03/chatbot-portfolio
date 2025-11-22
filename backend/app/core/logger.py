from loguru import logger

logger.add("logs/debug.log", rotation="1 week", retention="1 month")
