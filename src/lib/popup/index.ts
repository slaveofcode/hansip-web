import { $vfm, DynamicModalOptions } from "vue-final-modal";
import { uuid } from '../gen/uuid'
import PopupInfo from "../../components/PopupInfo.vue";

interface PopupInfoParam {
  title?: string;
  message: string;
}

const getModalComponent = (modalId: symbol): any | null => {
  let foundModal = null;
  for (const modal of $vfm.dynamicModals) {
    if (modal.id === modalId) {
      foundModal = modal;
      break;
    }
  }

  return foundModal;
};

export const showPopupInfo = (param: PopupInfoParam | string) => {
  const id = Symbol(uuid())

  let bindParam: PopupInfoParam
  if (typeof param === 'string') {
    bindParam = {
      message: param
    }
  } else {
    bindParam = param
  }

  $vfm.show({
    id,
    component: PopupInfo,
    bind: bindParam,
    on: {
      close(params: any) {
        const modal = getModalComponent(id);
        if (modal) {
          (modal as any).value = false;
        }
      },
    },
  } as DynamicModalOptions);
};
