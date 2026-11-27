import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { cn, focusRing, inputBox, listItem, separator, type WithClass } from './styles.ts';

/**
 * A text input that suggests values as you type; the text is the value. Pass `items`; the
 * list renders them through a function child. Label it with <Field> and <FieldLabel>.
 */
export const Autocomplete = BaseAutocomplete.Root;

/** The text box, shaped like <Input />. */
export function AutocompleteInput({
  className,
  ...props
}: WithClass<typeof BaseAutocomplete.Input>) {
  return (
    <BaseAutocomplete.Input className={cn(inputBox, 'w-full', focusRing, className)} {...props} />
  );
}

/** One suggestion. */
export function AutocompleteItem({ className, ...props }: WithClass<typeof BaseAutocomplete.Item>) {
  return <BaseAutocomplete.Item className={cn(listItem, className)} {...props} />;
}

export function AutocompleteSeparator({
  className,
  ...props
}: WithClass<typeof BaseAutocomplete.Separator>) {
  return <BaseAutocomplete.Separator className={cn(separator, className)} {...props} />;
}

// Base UI's Autocomplete reuses the Combobox's popup, list, empty message and groups, so these
// are the combobox's wrappers. Put <AutocompleteList /> inside <AutocompleteContent />.
export {
  ComboboxContent as AutocompleteContent,
  ComboboxList as AutocompleteList,
  ComboboxEmpty as AutocompleteEmpty,
  ComboboxGroup as AutocompleteGroup,
  ComboboxGroupLabel as AutocompleteGroupLabel,
} from './combobox.tsx';
