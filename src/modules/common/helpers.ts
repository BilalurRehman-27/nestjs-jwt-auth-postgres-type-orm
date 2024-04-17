import { User } from '../users/entities/user.entity';

type SortableProperty = string;
type SortDirection = 'asc' | 'desc';

export function sortByProperty(
  arr: Record<string, any>[],
  property: SortableProperty,
  direction: SortDirection = 'asc',
) {
  return arr.sort((a, b) => {
    // Extract the values of the property from the nested objects using property.split('.')
    const aValue = property.split('.').reduce((acc, prop) => acc[prop], a);
    const bValue = property.split('.').reduce((acc, prop) => acc[prop], b);

    // Handle case when aValue or bValue is null/undefined
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return direction === 'asc' ? -1 : 1;
    if (bValue == null) return direction === 'asc' ? 1 : -1;

    if (property === 'createdAt') {
      return direction === 'desc'
        ? new Date(bValue).getTime() - new Date(aValue).getTime()
        : new Date(aValue).getTime() - new Date(bValue).getTime();
    } else {
      // Sort alphabetically
      return direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    }
  });
}
