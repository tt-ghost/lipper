/* 默认配置 */
let defaultArgs = {
  duration: 1.5,
  selector: 'data-lipper',
  radius: 50,
  center: false,
  overflow: false,
  color: 'rgba(250, 250, 250, .3)',
  zindex: 1000
}

/* 缓存正在使用的配置 */
let config = {}

/* 基础样式 */
let baseStyle = `
  position: absolute;
  z-index: ${defaultArgs.zindex};
  pointer-events: none;
  border-radius: 50%;
  `

/* 初始化样式 */
let initStyle = `
  ${baseStyle}
  transform: translate3d(-50%, -50%, 0) scale(0);
  `

/* 是否初始化过 */
let inited = false

/* 缓存绑定的函数 */
function mousedown (e) {
  initDOM(config || {}, e)
}

/* 计算涟漪时的样式 */
function getActiveStyle (args, event, target) {
  // let target = event.target
  let duration = args.duration || defaultArgs.duration
  let radius = args.radius || defaultArgs.radius
  let color = args.color || defaultArgs.color
  let rect = target.getBoundingClientRect()
  // 从鼠标位置涟漪的样式
  let coorStyleDefault = `
    top: ${event.y - rect.top}px;
    left: ${event.x - rect.left}px;
  `
  // 从容器中心涟漪的样式
  let coorStyleCenter = `
    top: 50%;
    left: 50%;
  `
  let coorStyle = args.center === true ? coorStyleCenter : coorStyleDefault

  return `
    ${baseStyle}
    ${coorStyle}
    height: ${radius * 2}px;
    width: ${radius * 2}px;
    background-color: ${color};
    opacity: 0;
    transform: translate3d(-50%, -50%, 0) scale(1);
    transition: opacity ${args.duration}s cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform ${args.duration}s cubic-bezier(0.23, 1, 0.32, 1) 0ms;`
}

/* 初始化DOM节点 */
function initDOM (args, event) {
  let duration = args.duration || defaultArgs.duration
  let clickedTarget = event.target
  let target = getTargetContainer(clickedTarget, args.selector)
  let computedStyle = getComputedStyle(target)
  // TODO 记录原始位置信息，动画结束后需要清除
  // let cssText = event.target.style.cssText
  // let originPosition = 
  // let originOverflow = 
  let selectorList = getSelectorList(args.selector)
  if (selectorList.indexOf(target) > -1) {
    event.stopPropagation()
    setTargetStyle(target, computedStyle, args)
    let lipper = getLipperElement(target)
    setTimeout(function () {
      let activeStyle = getActiveStyle(args, event, target)
      lipper.setAttribute('style', activeStyle)
      setTimeout(function () {
        initLipper(target, lipper, computedStyle, initStyle, args)
      }, duration * 1000)
    }, 20)
  }
}

function setTargetStyle (target, computedStyle, args) {
  const positions = ['relative', 'absolute', 'fixed']
  if (positions.indexOf(computedStyle.position) === -1) {
    target.style.position = 'relative'
  }
  if (args.overflow) {
    if (computedStyle.overflow !== 'visible') {
      target.style.overflow = 'visible'
    }
  } else {
    if (computedStyle.overflow !== 'hidden') {
      target.style.overflow = 'hidden'
    }
  }
}

function getTargetContainer (target, selector) {
  let selectorList = getSelectorList(selector)
  let result = document.body
  function findParentNode (target) {
    if (selectorList.indexOf(target) > -1 || target === document.body) {
      result = target
    } else {
      target && findParentNode(target.parentNode)
    }
  }
  findParentNode(target)
  return result
}

function getSelectorList (selector) {
  let selectorList = []
  var sli = Array.prototype.slice;
  if (typeof selector === 'string') {
    selectorList = sli.call(document.querySelectorAll(selector))
  } else if (selector instanceof Array) {
    selector.forEach(item => {
      if (typeof item === 'string') {
        let selecteds = document.querySelectorAll(item)
        let tmpList = sli.call(selecteds)
        selectorList = selectorList.concat(tmpList)
      }
    })
  }
  return selectorList
}

/* 重置配置 */
function initLipper (target, lipper, computedStyle, initStyle, args) {
  lipper.setAttribute('style', initStyle)
  target.removeChild(lipper)
  setTargetStyle(target, computedStyle, args)
}

/* 生成涟漪效果节点并返回 */
function getLipperElement (container) {
  let lipper = document.createElement('span')
  lipper.setAttribute('style', initStyle)
  container.appendChild(lipper)
  return lipper
}

/* 初始化，只应该初始化一次 */
export function init (args) {
  if (!inited) {
    setConfig(args)
    document.addEventListener('mousedown', mousedown)
    inited = true
  }
}

function setConfig (args) {
  for (let i in args) {
    config[i] = args[i]
  }
}

/* 主动销毁特效，全局生效 */
export function destroy () {
  document.removeEventListener('mousedown', mousedown)
  inited = false
}

/* 修改配置 */
export function put (args) {
  setConfig(args)
  destroy()
  init()
}

/* 重置配置 */
export function reset () {
  for (let i in defaultArgs) {
    config[i] = defaultArgs[i]
  }
}

export default {
  init,
  destroy,
  put,
  reset
}
