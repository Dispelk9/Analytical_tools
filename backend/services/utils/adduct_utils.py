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
    

def subset_sum(numbers, low_limit, high_limit,number_of_hydro):

    """
    Returns: list of tuples: Each tuple contains a valid subset (as a list) and its sum rounded to 5 decimals.
    """
    result = []
    
    # Filter to include only numbers less than high_limit.
    # (If high_limit is positive, this helps avoid numbers that alone exceed the target.)
    filtered_numbers = [num for num in numbers if num < high_limit]
    filtered_numbers.sort()  # sort in ascending order
    
    target_plus = 1.007825
    target_minus = -1.007825

    def subset_calculation(start, current_subset, current_sum, count_plus, count_minus,number_of_hydro):
        # If current sum is within the target range (and the subset isn't empty),
        # record it.
        if current_subset and low_limit < current_sum < high_limit:
            result.append((list(current_subset), round(current_sum, 5)))
        
        # Explore further addition of candidates.
        # Iterate from 'start' to allow repeated choices (combinations with replacement).
        for i in range(start, len(filtered_numbers)):
            candidate = filtered_numbers[i]
            
            # Update counts for special numbers.
            new_count_plus = count_plus
            new_count_minus = count_minus
            if candidate == target_plus:
                if count_plus >= number_of_hydro:
                    continue  # skip adding candidate if 1.007825 already appears number_of_hydro times
                new_count_plus += 1
            elif candidate == target_minus:
                if count_minus >= number_of_hydro:
                    continue  # skip adding candidate if -1.007825 already appears number_of_hydro times
                new_count_minus += 1
            
            new_sum = current_sum + candidate

            # Prune: If candidate is positive and adding it drives sum above high_limit,
            # further candidates (which are >= current candidate due to sorting) will also fail.
            if candidate > 0 and new_sum > high_limit:
                break
            
            # Choose candidate
            current_subset.append(candidate)
            # Allow the same candidate again (hence 'i' not 'i+1')
            subset_calculation(i, current_subset, new_sum, new_count_plus, new_count_minus,number_of_hydro)
            # Backtrack
            current_subset.pop()

    subset_calculation(0, [], 0, 0, 0,number_of_hydro)
    return result


def dict_to_formula(components):
    formula = ""
    for element, count in components.items():
        # Add the count if it’s greater than 1
        if count > 1:
            formula += str(count)
        # Add the element symbol
        formula += element + " "
    return formula

