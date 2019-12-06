/**
 * Created by phung.nguyen on 11/20/2018
 */
const BaseAutoBindedClass = require(`${global.APP_BASE_PACKAGE_PATH}/base-autobind`)

class BaseManager extends BaseAutoBindedClass {
  constructor() {
    super()
    if (new.target === BaseManager) {
      throw new TypeError('Cannot construct BaseManager instances directly')
    }
  }
}
module.exports = BaseManager
