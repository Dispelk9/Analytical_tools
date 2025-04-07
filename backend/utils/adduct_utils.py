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
    Find all subsets of 'numbers' (allowing duplicates) whose sums fall within the range (low_limit, high_limit),
    with the additional condition that if the number 1.007825 or -1.007825 appears more than 3 times in a subset,
    that subset is skipped.

    Args:
        numbers (list): List of numbers to consider (duplicates allowed).
        low_limit (float): Lower bound of the range (exclusive).
        high_limit (float): Upper bound of the range (exclusive).

    Returns:
        list: A list of tuples, where each tuple contains a subset (as a list) and its rounded sum.
    """
    # Filter numbers to include only those smaller than high_limit
    filtered_numbers = [num for num in numbers if num < high_limit]

    result = []

    # Generate all subsets with replacements and check their sums
    max_len = len(filtered_numbers)  # Limit to avoid infinite results
    for r in range(1, max_len + 1):
        for subset in combinations_with_replacement(filtered_numbers, r):
            # Skip this subset if 1.007825 or -1.007825 appears more than 3 times
            if subset.count(1.007825) > 3 or subset.count(-1.007825) > 3:
                continue

            subset_total = sum(subset)
            if low_limit < subset_total < high_limit:
                result.append((list(subset), round(subset_total, 5)))

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

