import { Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import {
  DynamicListAddButton,
  DynamicListContainer,
  DynamicListItem,
  DynamicListItemHeader,
  DynamicListItemNumber,
  DynamicListRemoveBtn,
} from "../styles";

interface DynamicListProps<T> {
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number) => ReactNode;
  addLabel: string;
  itemLabel?: string;
  minItems?: number;
  disabled?: boolean;
}

const DynamicList = <T,>({
  items,
  onAdd,
  onRemove,
  renderItem,
  addLabel,
  itemLabel = "Item",
  minItems = 1,
  disabled,
}: DynamicListProps<T>) => {
  const canRemove = items.length > minItems;

  return (
    <DynamicListContainer>
      {items.map((item, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: itens do formulário sem ID estável
        <DynamicListItem key={`item-${index}`}>
          <DynamicListItemHeader>
            <DynamicListItemNumber>
              {itemLabel} {index + 1}
            </DynamicListItemNumber>
            {canRemove && (
              <DynamicListRemoveBtn
                type="button"
                title="Remover item"
                onClick={() => onRemove(index)}
                disabled={disabled}
              >
                <Trash2 size={14} />
              </DynamicListRemoveBtn>
            )}
          </DynamicListItemHeader>
          {renderItem(item, index)}
        </DynamicListItem>
      ))}

      <DynamicListAddButton type="button" onClick={onAdd} disabled={disabled}>
        <Plus size={14} />
        {addLabel}
      </DynamicListAddButton>
    </DynamicListContainer>
  );
};

export default DynamicList;
