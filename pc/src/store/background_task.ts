import { defineStore } from "pinia";

export default defineStore("backgrond_task", function() {
  
  let listDialogVisible = $ref<boolean>(false);
  
  return {
    listDialogVisible: $$(listDialogVisible),
  };
  
});
