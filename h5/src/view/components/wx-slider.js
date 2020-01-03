// wx-slider

const model = {
  is: 'wx-slider',
  template: `\n    <div class="wx-slider-wrapper" class.wx-slider-disabled="{{disabled}}">\n      
                        <div class="wx-slider-tap-area" id="wrapper">\n        
                            <div class="wx-slider-handle-wrapper" style.background-color="{{backgroundColor}}">\n          
                                <div class="wx-slider-handle" style.left="{{_getValueWidth(value,min,max)}}" style.background-color="{{blockColor}}" id="handle"></div>\n          
                                <div class="wx-slider-track" style.width="{{_getValueWidth(value,min,max)}}" style.background-color="{{activeColor}}"></div>\n          
                                <div class="wx-slider-step" id="step"></div>\n        
                            </div>\n      
                        </div>\n      
                        <span hidden$="{{!showValue}}" class="wx-slider-value">\n        
                            <p parse-text-content>{{value}}</p>\n      
                        </span>\n    
                    </div>\n  `,
  properties: {
    min: {
      type: Number,
      value: 0,
      public: !0,
      observer: '_revalicateRange'
    },
    max: {
      type: Number,
      value: 100,
      public: !0,
      observer: '_revalicateRange'
    },
    step: {
      type: Number,
      value: 1,
      public: !0
    },
    value: {
      type: Number,
      value: 0,
      public: !0,
      coerce: '_filterValue'
    },
    showValue: {
      type: Boolean,
      value: !1,
      public: !0
    },
    backgroundColor: {
      type: String,
      value: '#e9e9e9'
    },
    activeColor: {
      type: String,
      value: '#1aad19'
    },
    blockSize: {
      type: Number,
      value: 28,
      public: !0,
      observer: '_onBlockChange'
    },
    blockColor: {
      type: String,
      value: '#fff',
      public: !0
    }
  },
  listeners: {
    'wrapper.tap': '_onTap'
  },
  behaviors: ['wx-base', 'wx-data-Component', 'wx-disabled', 'wx-touchtrack'],
  created: function () {
    this.touchtrack(this.$.handle, '_onTrack')
  },
  _onBlockChange: function () {
    var n = this.blockSize
    var node = this.$.handle
    node.style.width = n + 'px'
    node.style.height = n + 'px'
    node.style.marginTop = -n / 2 + 'px'
    node.style.marginLeft = -n / 2 + 'px'
  },
  _filterValue: function (val) {
    if (val < this.min) return this.min
    if (val > this.max) return this.max
    var stepWidth = Math.round((val - this.min) / this.step)
    return stepWidth * this.step + this.min
  },
  _revalicateRange: function () {
    this.value = this._filterValue(this.value)
  },
  _getValueWidth: function (val, min, max) {
    return 100 * (val - min) / (max - min) + '%'
  },
  _getXPosition: function (ele) {
    for (var width = ele.offsetLeft; ele; ele = ele.offsetParent) {
      width += ele.offsetLeft
    }
    return width - document.body.scrollLeft
  },
  _onUserChangedValue: function (event) {
    var offsetWidth = this.$.step.offsetWidth,
      currPos = this._getXPosition(this.$.step),
      value =
        (event.detail.x - currPos) * (this.max - this.min) / offsetWidth +
        this.min
      ;(value = this._filterValue(value)), (this.value = value)
  },
  _onTrack: function (event) {
    if (this.disabled) return

    event.preventDefault()

    var state = event.detail.state
    switch (state) {
      case 'move':
        this._onUserChangedValue(event)
        this.triggerEvent('changing', { value: this.value })
        break
      case 'end':
        this.triggerEvent('change', { value: this.value })
        break
    }
  },
  _onTap: function (event) {
    this.disabled ||
      (this._onUserChangedValue(event),
      this.triggerEvent('change', {
        value: this.value
      }))
  },
  resetFormData: function () {
    this.value = this.min
  }
}
const component = window.exparser.registerElement(model)

export default component
