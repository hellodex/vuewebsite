export const funParabola = function (element: any, target: any, options: any = {}) {
  const defaults: any = {
    speed: 166.67, // 每帧移动的像素大小，每帧（对于大部分显示屏）大约16~17毫秒
    curvature: 0.001, // 实际指焦点到准线的距离，你可以抽象成曲率，这里模拟扔物体的抛物线，因此是开口向下的
    progress: function () {},
    complete: function () {}
  }

  const params: any = {}

  for (const key in defaults) {
    params[key] = options[key] || defaults[key]
  }

  const exports: any = {
    mark: function () {
      return this
    },
    position: function () {
      return this
    },
    move: function () {
      return this
    },
    init: function () {
      return this
    }
  }

  /* 确定移动的方式
   * IE6-IE8 是margin位移
   * IE9+使用transform
   */
  let moveStyle = 'margin'
  const testDiv = document.createElement('div')
  if ('oninput' in testDiv) {
    ;['', 'ms', 'webkit'].forEach(function (prefix) {
      const transform = prefix + (prefix ? 'T' : 't') + 'ransform'
      if (transform in testDiv.style) {
        moveStyle = transform
      }
    })
  }

  // 根据两点坐标以及曲率确定运动曲线函数（也就是确定a, b的值）
  /* 公式： y = a*x*x + b*x + c;
   */
  // eslint-disable-next-line prefer-const
  let a = params.curvature
  let b = 0
  const c = 0

  // 是否执行运动的标志量
  let flagMove = true

  if (element && target && element.nodeType == 1 && target.nodeType == 1) {
    let rectElement: any = {},
      rectTarget: any = {}

    // 移动元素的中心点位置，目标元素的中心点位置
    let centerElement: any = {},
      centerTarget: any = {}

    // 目标元素的坐标位置
    let coordElement: any = {},
      coordTarget: any = {}

    // 标注当前元素的坐标
    exports.mark = function () {
      if (flagMove == false) return this
      if (typeof coordElement.x == 'undefined') this.position()
      element.setAttribute('data-center', [coordElement.x, coordElement.y].join())
      target.setAttribute('data-center', [coordTarget.x, coordTarget.y].join())
      return this
    }

    exports.position = function () {
      if (flagMove == false) return this

      const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft,
        scrollTop = document.documentElement.scrollTop || document.body.scrollTop

      // 初始位置
      if (moveStyle == 'margin') {
        element.style.marginLeft = element.style.marginTop = '0px'
      } else {
        element.style[moveStyle] = 'translate(0, 0)'
      }

      // 四边缘的坐标
      rectElement = element.getBoundingClientRect()
      rectTarget = target.getBoundingClientRect()

      // 移动元素的中心点坐标
      centerElement = {
        x: rectElement.left + (rectElement.right - rectElement.left) / 2 + scrollLeft,
        y: rectElement.top + (rectElement.bottom - rectElement.top) / 2 + scrollTop
      }

      // 目标元素的中心点位置
      centerTarget = {
        x: rectTarget.left + (rectTarget.right - rectTarget.left) / 2 + scrollLeft,
        y: rectTarget.top + (rectTarget.bottom - rectTarget.top) / 2 + scrollTop
      }

      // 转换成相对坐标位置
      coordElement = {
        x: 0,
        y: 0
      }
      coordTarget = {
        x: -1 * (centerElement.x - centerTarget.x),
        y: -1 * (centerElement.y - centerTarget.y)
      }

      /*
       * 因为经过(0, 0), 因此c = 0
       * 于是：
       * y = a * x*x + b*x;
       * y1 = a * x1*x1 + b*x1;
       * y2 = a * x2*x2 + b*x2;
       * 利用第二个坐标：
       * b = (y2+ a*x2*x2) / x2
       */
      // 于是
      b = (coordTarget.y - a * coordTarget.x * coordTarget.x) / coordTarget.x

      return this
    }

    // 按照这个曲线运动
    exports.move = function () {
      // 如果曲线运动还没有结束，不再执行新的运动
      if (flagMove == false) return this

      let startx = 0
      const rate = coordTarget.x > 0 ? 1 : -1

      const step = function () {
        // 切线 y'=2ax+b
        const tangent = 2 * a * startx + b // = y / x
        // y*y + x*x = speed
        // (tangent * x)^2 + x*x = speed
        // x = Math.sqr(speed / (tangent * tangent + 1));
        startx = startx + rate * Math.sqrt(params.speed / (tangent * tangent + 1))

        // 防止过界
        if ((rate == 1 && startx > coordTarget.x) || (rate == -1 && startx < coordTarget.x)) {
          startx = coordTarget.x
        }
        const x = startx,
          y = a * x * x + b * x

        // 标记当前位置，这里有测试使用的嫌疑，实际使用可以将这一行注释
        element.setAttribute('data-center', [Math.round(x), Math.round(y)].join())

        // x, y目前是坐标，需要转换成定位的像素值
        if (moveStyle == 'margin') {
          element.style.marginLeft = x + 'px'
          element.style.marginTop = y + 'px'
        } else {
          element.style[moveStyle] = 'translate(' + [x + 'px', y + 'px'].join() + ')'
        }

        if (startx !== coordTarget.x) {
          params.progress(x, y)
          window.requestAnimationFrame(step)
        } else {
          // 运动结束，回调执行
          params.complete()
          flagMove = true
        }
      }
      window.requestAnimationFrame(step)
      flagMove = false

      return this
    }

    // 初始化方法
    exports.init = function () {
      this.position().mark().move()
    }
  }

  return exports
}
