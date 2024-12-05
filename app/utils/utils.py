def convert_float(value):
    """
    Convert a string with a comma as the decimal separator to a float.

    Args:
        value (str): The input string.

    Returns:
        float: The converted float value.
    """
    try:
        if "," in value:
            value = value.replace(',', '.')
        return float(value)
    except ValueError:
        raise ValueError(f"Invalid input for conversion: {value}")
