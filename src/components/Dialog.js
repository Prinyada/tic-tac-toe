import React from "react";
import "./Dialog.css";

function Dialog(props) {
  let dialog = (
    <div className="dialog-style">
      <div className="dialog-header">
        <p className="text-dialog-header">ข้อตกลงในการใช้งาน</p>
        <button className="dialog-closeButtonStyle" onClick={props.onClose}>
          x
        </button>
      </div>
      <div className="dialog-content">
        <p className="text-dialog">
          1. ระบบเป็นเพียงสื่อกลางในการให้บริการรับ ส่ง จัดเก็บข้อมูล
          เพื่ออำนวยความสะดวก ในการติดต่อสื่อสารให้แก่ผู้ใช้งานเท่านั้น
          ไม่มีส่วนเกี่ยวข้องกับธุรกรรมการเงินใดๆทั้งสิ้น
        </p>
        <p className="text-dialog">
          2. ทางผู้พัฒนาสามารถนำข้อมูลจาก"กลุ่มเฟซบุ๊ก Kumtnb
          Community"มาใช้ได้ถูกต้องตามกฎหมายเพราะกลุ่มเฟซบุ๊กดังกล่าวเป็น
          กลุ่มสาธารณะ
        </p>
      </div>
    </div>
  );

  if (!props.isOpen) {
    dialog = null;
  }
  return <div>{dialog}</div>;
}

export default Dialog;
