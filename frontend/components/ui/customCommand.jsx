"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

// Context to provide label search functionality across components
const CommandSearchContext = React.createContext({
  searchQuery: "",
  setSearchQuery: () => {},
  filterItems: () => [],
  labelField: "label",
  valueField: "value",
  items: [],
  setItems: () => {},
  selectedItem: null,
  setSelectedItem: () => {},
});

// Custom Command root component
const LabelSearchCommand = React.forwardRef(
  (
    {
      children,
      className,
      labelField = "label",
      valueField = "value",
      items = [],
      onValueChange = () => {},
      defaultValue = null,
      ...props
    },
    ref
  ) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [internalItems, setInternalItems] = React.useState(items);
    const [selectedItem, setSelectedItem] = React.useState(null);

    React.useEffect(() => {
      // If defaultValue is provided, find the corresponding item
      if (defaultValue && items?.length) {
        const defaultItem = items?.find(
          (item) => item[valueField] === defaultValue
        );
        if (defaultItem) {
          setSelectedItem(defaultItem);
        }
      }
    }, [defaultValue, items, valueField]);

    React.useEffect(() => {
      setInternalItems(items);
    }, [items]);

    // Update parent component when selection changes
    React.useEffect(() => {
      if (selectedItem && selectedItem[valueField] !== defaultValue) {
        onValueChange(selectedItem);
      }
    }, [selectedItem, onValueChange, valueField, defaultValue]);

    const filterItems = React.useCallback(
      (allItems) => {
        if (!searchQuery) return allItems;

        return allItems.filter((item) => {
          const label = item[labelField];
          if (typeof label !== "string") return false;
          return label.toLowerCase().includes(searchQuery.toLowerCase());
        });
      },
      [searchQuery, labelField]
    );

    const contextValue = React.useMemo(
      () => ({
        searchQuery,
        setSearchQuery,
        filterItems,
        labelField,
        valueField,
        items: internalItems,
        setItems: setInternalItems,
        selectedItem,
        setSelectedItem,
      }),
      [
        searchQuery,
        filterItems,
        labelField,
        valueField,
        internalItems,
        selectedItem,
      ]
    );

    return (
      <CommandSearchContext.Provider value={contextValue}>
        <CommandPrimitive
          ref={ref}
          className={cn(
            "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
            className
          )}
          {...props}
        >
          {children}
        </CommandPrimitive>
      </CommandSearchContext.Provider>
    );
  }
);
LabelSearchCommand.displayName = "LabelSearchCommand";

// Custom Command Input component
const LabelSearchCommandInput = React.forwardRef(
  ({ className, ...props }, ref) => {
    const { searchQuery, setSearchQuery } =
      React.useContext(CommandSearchContext);

    return (
      <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
        <MagnifyingGlassIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <CommandPrimitive.Input
          ref={ref}
          value={searchQuery}
          onValueChange={setSearchQuery}
          className={cn(
            "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
LabelSearchCommandInput.displayName = "LabelSearchCommandInput";

// Custom Command List component with filtering
const LabelSearchCommandList = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const { filterItems, items } = React.useContext(CommandSearchContext);
    const filteredItems = filterItems(items);

    const clonedChildren = React.Children.map(children, (child) => {
      if (
        React.isValidElement(child) &&
        child.type === LabelSearchCommandGroup
      ) {
        return React.cloneElement(child, { filteredItems });
      }
      return child;
    });

    return (
      <CommandPrimitive.List
        ref={ref}
        className={cn(
          "max-h-[300px] overflow-y-auto overflow-x-hidden",
          className
        )}
        {...props}
      >
        {clonedChildren}
      </CommandPrimitive.List>
    );
  }
);
LabelSearchCommandList.displayName = "LabelSearchCommandList";

// Custom Command Empty
const LabelSearchCommandEmpty = React.forwardRef((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
));
LabelSearchCommandEmpty.displayName = "LabelSearchCommandEmpty";

// Custom Command Group with filtered items
const LabelSearchCommandGroup = React.forwardRef(
  ({ className, children, filteredItems, render, ...props }, ref) => {
    return (
      <CommandPrimitive.Group
        ref={ref}
        className={cn(
          "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-muted-foreground",
          className
        )}
        {...props}
      >
        {render ? render(filteredItems) : children}
      </CommandPrimitive.Group>
    );
  }
);
LabelSearchCommandGroup.displayName = "LabelSearchCommandGroup";

// Custom Command Item
const LabelSearchCommandItem = React.forwardRef(
  ({ className, value, onSelect, children, ...props }, ref) => {
    const { valueField, selectedItem, setSelectedItem, items, setSearchQuery } =
      React.useContext(CommandSearchContext);

    const isSelected = selectedItem && selectedItem[valueField] === value;

    const handleSelect = () => {
      const item = items?.find((item) => item[valueField] === value);
      if (item) {
        setSelectedItem(item);
        setSearchQuery("");
        if (onSelect) {
          onSelect(item);
        }
      }
    };

    return (
      <CommandPrimitive.Item
        ref={ref}
        value={value}
        onSelect={() => handleSelect()}
        className={cn(
          "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between w-full">
          <div>{children}</div>
          {isSelected && <Check className="h-4 w-4 ml-2" />}
        </div>
      </CommandPrimitive.Item>
    );
  }
);
LabelSearchCommandItem.displayName = "LabelSearchCommandItem";

// Re-export other command components
const CommandSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandShortcut = ({ className, ...props }) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

// Combobox component that combines all the pieces
const LabelSearchCombobox = ({
  name,
  items = [],
  value,
  labelField = "label",
  valueField = "value",
  placeholder = "Search...",
  className,
  triggerClassName,
  contentClassName,
  onValueChange = () => {},
  buttonText = "Select option",
  emptyMessage = "No results found",
  disabled = false,
  renderItem,
}) => {
  const [open, setOpen] = useState(false);

  const selected = React.useMemo(() => {
    return items?.find((item) => item[valueField] === value) || null;
  }, [value, items, valueField]);

  const handleValueChange = (item) => {
    setOpen(false);
    const syntheticEvent = {
      target: {
        name,
        value: item?.[valueField],
        item,
      },
    };
    onValueChange(syntheticEvent);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 font-normal overflow-hidden",
            triggerClassName
          )}
        >
          {selected ? selected[labelField] : buttonText}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0 w-full", contentClassName)}>
        <LabelSearchCommand
          labelField={labelField}
          valueField={valueField}
          items={items}
          defaultValue={value}
          onValueChange={handleValueChange}
          className={className}
        >
          <LabelSearchCommandInput placeholder={placeholder} />
          <LabelSearchCommandList>
            <LabelSearchCommandEmpty>{emptyMessage}</LabelSearchCommandEmpty>
            <LabelSearchCommandGroup
              render={(filteredItems) => (
                <>
                  {filteredItems?.map((item) => (
                    <LabelSearchCommandItem
                      key={item[valueField]}
                      value={item[valueField]}
                    >
                      {renderItem ? renderItem(item) : item[labelField]}
                    </LabelSearchCommandItem>
                  ))}
                </>
              )}
            />
          </LabelSearchCommandList>
        </LabelSearchCommand>
      </PopoverContent>
    </Popover>
  );
};

export {
  LabelSearchCommand,
  LabelSearchCommandInput,
  LabelSearchCommandList,
  LabelSearchCommandEmpty,
  LabelSearchCommandGroup,
  LabelSearchCommandItem,
  CommandSeparator,
  CommandShortcut,
  LabelSearchCombobox,
};
