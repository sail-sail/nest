
const listDialogVisible = ref(false);

export default function() {
  
  return {
    get listDialogVisible() {
      return listDialogVisible.value;
    },
    set listDialogVisible(value: boolean) {
      listDialogVisible.value = value;
    },
  };
  
};
