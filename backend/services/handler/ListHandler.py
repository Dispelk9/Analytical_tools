import logging

# Custom Handler that appends log messages to a list.
class ListHandler(logging.Handler):
    def __init__(self, log_list, level=logging.NOTSET):
        super().__init__(level)
        self.log_list = log_list

    def emit(self, record):
        # Format the record using the set formatter and append it to log_entries.
        log_entry = self.format(record)
        self.log_list.append(log_entry)

