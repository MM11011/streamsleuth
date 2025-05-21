import csv
import io

def parse_data_classification_csv(file_content, filter_field=None, filter_value=None):
    reader = csv.DictReader(io.StringIO(file_content))
    filtered_rows = []

    for row in reader:
        # Drop noisy fields for display (not export)
        display_row = {k: v for k, v in row.items() if k not in ["Description", "Help_Text"]}

        # Apply filtering if requested
        if filter_field and filter_value is not None:
            if row.get(filter_field, "").strip() == filter_value:
                filtered_rows.append(display_row)
        else:
            filtered_rows.append(display_row)

    return filtered_rows, reader.fieldnames  # Return headers for export use
