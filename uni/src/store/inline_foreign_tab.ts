
export function useInlineForeignTab(
  inputsFn: () => unknown & {
    order_by?: number | null;
  }[] | null | undefined,
) {
  
  let index_selected = $ref<number[]>([ ]);
  
  function onRow(
    index: number,
  ) {
    index_selected = [ index ];
  }
  
  function onSelect(
    checked: boolean,
    index: number,
  ) {
    if (checked) {
      if (!index_selected.includes(index)) {
        index_selected.push(index);
      }
    } else {
      index_selected = index_selected.filter((item) => item !== index);
    }
  }
  
  function onSelectAll(
    checked: boolean,
    data_length: number,
  ) {
    if (checked) {
      index_selected = Array.from({ length: data_length }, (_, i) => i);
    } else {
      index_selected = [ ];
    }
  }
  
  /** 向上移动 */
  function onUp() {
    const inputs = inputsFn() || [ ];
    if (index_selected.length === 0) {
      return;
    }
    index_selected.sort((a, b) => a - b);
    for (const index of index_selected) {
      if (index === 0) {
        continue;
      }
      const temp = inputs[index - 1];
      inputs[index - 1] = inputs[index];
      inputs[index] = temp;
    }
    index_selected = index_selected.map((i) => (i > 0 ? i - 1 : i));
    // 重新设置 order_by
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].order_by = i + 1;
    }
  }
  
  /** 向下移动 */
  function onDown() {
    const inputs = inputsFn() || [ ];
    if (index_selected.length === 0) {
      return;
    }
    index_selected.sort((a, b) => b - a);
    for (const index of index_selected) {
      if (index === inputs.length - 1) {
        continue;
      }
      const temp = inputs[index + 1];
      inputs[index + 1] = inputs[index];
      inputs[index] = temp;
    }
    index_selected = index_selected.map((i) => (i < inputs!.length - 1 ? i + 1 : i));
    // 重新设置 order_by
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].order_by = i + 1;
    }
  }
  
  function onDelete() {
    const inputs = inputsFn() || [ ];
    if (index_selected.length === 0) {
      return;
    }
    index_selected.sort((a, b) => b - a);
    for (const index of index_selected) {
      inputs.splice(index, 1);
    }
    index_selected = [ ];
  }
  
  return {
    index_selected: $$(index_selected),
    onRow,
    onUp,
    onDown,
    onDelete,
    onSelect,
    onSelectAll,
  };
}
