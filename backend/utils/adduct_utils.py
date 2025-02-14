from itertools import combinations_with_replacement

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
    

def subset_sum(numbers, low_limit, high_limit):
    """
    Find all subsets of 'numbers' (allowing duplicates) whose sums fall within the range (low_limit, high_limit).

    Args:
        numbers (list): List of numbers to consider (duplicates allowed).
        low_limit (float): Lower bound of the range (exclusive).
        high_limit (float): Upper bound of the range (exclusive).

    Returns:
        list: A list of tuples, where each tuple contains a subset and its sum.
    """
    # Filter numbers to include only those smaller than high_limit
    filtered_numbers = [num for num in numbers if num < high_limit]
    #print(f"Filtered Numbers: {filtered_numbers}")

    # Store results
    result = []

    # Generate all subsets with replacements and check their sums
    max_len = len(filtered_numbers)  # Avoid infinite results by limiting the length
    for r in range(1, max_len + 1):  # Generate subsets of all sizes up to max_len
        for subset in combinations_with_replacement(filtered_numbers, r):
            subset_sum = sum(subset)
            if low_limit < subset_sum < high_limit:
                result.append((list(subset), round(subset_sum, 5)))

    return result

def dict_to_formula(components):
    formula = ""
    for element, count in components.items():
        # Add the count if it’s greater than 1
        if count > 1:
            formula += str(count)
        # Add the element symbol
        formula += element + ","
    return formula

