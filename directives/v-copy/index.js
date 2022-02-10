function getStr(directVal) {
  let str = directVal;
  if (typeof directVal === 'object') {
    str = directVal.str;
  }
  return str;
}

function copyString(str) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(str);
  }
  const input = document.createElement('textarea');
  input.readOnly = 'readonly';
  input.style.position = 'fixed';
  input.style.clip = 'rect(0 0 0 0)';
  input.style.top = '10px';
  input.value = str;
  document.body.appendChild(input);
  input.select();
  const isSuccess = document.execCommand('copy');
  document.body.removeChild(input);
  return isSuccess;
}

export default {
  inserted(el, binding) {
    const directVal = binding.value;
    let targetEle = el;
    if (typeof directVal === 'object') {
      targetEle = el.querySelector(directVal.target);
    }
    const copyAct = () => {
      const txt = el._value !== undefined ? el._value : targetEle.textContent;
      copyString(txt);
    };
    el._value = getStr(directVal);
    el._copyAct_ = copyAct;
    targetEle.addEventListener('click', copyAct);
    targetEle.style.cursor = 'pointer';
    targetEle.style['text-decoration'] = 'underline';
  },
  unbind(el, binding) {
    const directVal = binding.value;
    if (typeof directVal === 'object') {
      el.querySelector(directVal.target).removeEventListener('click', el._copyAct_);
    } else {
      el.removeEventListener('click', el._copyAct_);
    }
  },
  update(el, binding) {
    el._value = getStr(binding.value);
  },
};
