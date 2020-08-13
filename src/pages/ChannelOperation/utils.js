// AOP effects织入函数
export const effectsAOP = (function IIFE() {
  const before = Symbol('before');
  const after = Symbol('after');

  // 函数执行之前织入
  // eslint-disable-next-line no-extend-native
  Function.prototype[before] = function bef(beforeFn) {
    const self = this;
    if (self.constructor.name === 'GeneratorFunction') {
      return function* genFn(...rest) {
        let ret; // 收集返回值
        ret = yield beforeFn.apply(this, rest);
        const gen = self.apply(this, rest);
        for (let result = gen.next(ret); result.done === false; result = gen.next(ret)) {
          ret = yield result.value;
        }
      };
    }
    return self;
  };

  // 函数执行之后织入
  // eslint-disable-next-line no-extend-native
  Function.prototype[after] = function aft(afterFn) {
    const self = this;
    if (self.constructor.name === 'GeneratorFunction') {
      return function* genFn(...rest) {
        const ret = []; // 收集返回值
        const gen = self.apply(this, rest);
        for (let i = -1, result = gen.next(); result.done === false; result = gen.next(ret[i])) {
          ret[(i += 1)] = yield result.value;
        }
        yield afterFn.apply(this, [...rest, ret.splice(1)]);
      };
    }
    return self;
  };

  return function effectsAop(effects, beforeFn, afterFn) {
    if (typeof beforeFn !== 'function' && Boolean(beforeFn) !== false) {
      throw new Error('第二个参数必须为函数或null');
    }
    if (typeof afterFn !== 'function' && Boolean(afterFn) !== false) {
      throw new Error('第三个参数必须为函数或不传参数');
    }

    const newEffects = {};

    Object.keys(effects).forEach(key => {
      if (beforeFn && afterFn) {
        newEffects[key] = effects[key][before](beforeFn)[after](afterFn);
      } else if (beforeFn && !afterFn) {
        newEffects[key] = effects[key][before](beforeFn);
      } else if (!beforeFn && afterFn) {
        newEffects[key] = effects[key][after](afterFn);
      }
    });

    return String(Object.keys(newEffects)) ? newEffects : effects;
  };
})();

// 获取数字字典
// @params attrSpecCode String || Array[String] 字典请求字段
export function getAttrValueByCode(attrSpecCode) {
  const { dispatch } = this.props;
  const ACTION_TYPE = 'common/qryAttrValueByCode';

  if (typeof dispatch !== 'function') {
    return new Error('You should use connect() of dva');
  }
  if (typeof attrSpecCode === 'string') {
    return dispatch({
      type: ACTION_TYPE,
      payload: {
        attrSpecCode,
      },
    });
  }
  if (Array.isArray(attrSpecCode)) {
    return attrSpecCode.map(item => {
      return dispatch({
        type: ACTION_TYPE,
        payload: {
          attrSpecCode: item,
        },
      });
    });
  }

  return new Error(`Expected param: String or Array[String], but not.`);
}
