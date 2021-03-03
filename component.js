const component = {
  createInput: function(id, label, defaultValue='', placeHolder='') {
    if (!label) {
      label = id.substr(0,1).toUpperCase() + id.substr(1, id.length-1);
    }

    return $(`<div class="form-group row">
      <label for="staticEmail" class="col-sm-4 col-form-label col-form-label-sm">${label}</label>
      <div class="col-sm-8">
        <input type="number" class="form-control form-control-sm" id="${id}" value="${defaultValue}" placeholder="${placeHolder}">
      </div>
    </div>`);
  },
  createDropdown: function(id, label, options) {
    if (!label) {
      label = id.substr(0,1).toUpperCase() + id.substr(1, id.length-1);
    }

    const strings = [];
    for (let i = 0; i < options.length; i++) {
      strings.push(`<option ${options[i].selected ? 'selected' : ''} value="${options[i].value}">${options[i].label}</option>`);
    }

    return $(`<div class="form-group row">
      <label for="staticEmail" class="col-sm-4 col-form-label col-form-label-sm">${label}</label>
      <div class="col-sm-8">
        <select class="custom-select my-1 mr-sm-2 form-control form-control-sm" id="${id}">
          ${strings.join()}
        </select>
      </div>
    </div>`);
  },
  createCheckBox: function(id, label) {
    if (!label) {
      label = id.substr(0,1).toUpperCase() + id.substr(1, id.length-1);
    }

    return $(`<div class="form-check">
      <input class="form-check-input" type="checkbox" value="" id="${id}">
      <label class="form-check-label" for="${id}">
        ${label}
      </label>
    </div>`);
  },
  createBoxBorderDropDown: function() {
    const buttonGroup = $(`<div class="form-group row">
    <label for="staticEmail" class="col-sm-4 col-form-label col-form-label-sm">Wall type</label>
      <div class="col-sm-8 btn-group"">
        <button id="wallType" class="btn btn-outline-primary btn-block btn-sm " type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
         
        </button>
        <div class="dropdown-menu">
        </div>
      </div>
    </div>`);

    const borderArray = [
      [false,false,false,false],
      [true,false,false,false],
      [false,true,false,false],
      [false,false,true,false],
      [false,false,false,true],
      [true,true,false,false],
      [true,false,true,false],
      [true,false,false,true],
      [false,true,true,false],
      [false,true,false,true],
      [false,false,true,true],
      [true,true,true,false],
      [true,true,false,true],
      [true,false,true,true],
      [false,true,true,true],
      [true,true,true,true],
    ];


    for (let i = 0; i < borderArray.length; i++) {
      const dropdownItem = $(`<a class="dropdown-item" href="#"></a>`);
      const boxOption = $(`<div></div>`).addClass("box-option");
      const borderText = '3px solid #ecf0f1';
      boxOption.css({
        borderTop:    borderArray[i][0] ? borderText : "",
        borderRight:  borderArray[i][1] ? borderText : "",
        borderBottom: borderArray[i][2] ? borderText : "",
        borderLeft:   borderArray[i][3] ? borderText : "",
      });
      const text = [];
      if (borderArray[i][0]) {
        text.push("top");
      }
      if (borderArray[i][1]) {
        text.push("right");
      }
      if (borderArray[i][2]) {
        text.push("bottom");
      }
      if (borderArray[i][3]) {
        text.push("left");
      }
      if (text.length == 0) {
        text.push("none");
      }
      dropdownItem.append(boxOption).append(text.join(" "));
      dropdownItem.click(function() {
        buttonGroup.find("#wallType").data("walls", borderArray[i]).html(boxOption.prop("outerHTML"));
        $("#clickAction").val("CHANGE_WALL");
      })
      if (i == borderArray.length - 1) {
        buttonGroup.find("#wallType").data("walls", borderArray[i]).html(boxOption.prop("outerHTML"));
      }
      buttonGroup.find(".dropdown-menu").append(dropdownItem);
    }

    return buttonGroup;
  },
  createButton: function(text, onClick) {
    return  $(`<button type="button">${text}</button>`).addClass('btn btn-outline-primary btn-sm btn-block').click(onClick);
  }
}