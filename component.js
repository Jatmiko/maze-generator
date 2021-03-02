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

    return `<div class="form-group row">
      <label for="staticEmail" class="col-sm-4 col-form-label col-form-label-sm">${label}</label>
      <div class="col-sm-8">
        <select class="custom-select my-1 mr-sm-2 form-control form-control-sm" id="${id}">
          ${strings.join()}
        </select>
      </div>
    </div>`;
  },
  createButton: function(text, onClick) {
    return  $(`<button type="button">${text}</button>`).addClass('btn btn-outline-primary btn-sm btn-block').click(onClick);
  }
}