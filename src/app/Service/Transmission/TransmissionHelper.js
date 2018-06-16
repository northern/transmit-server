
import Twig from 'twig'

export default class TransmissionHelper {
  getCombinedVars(templateVars, transmissionVars) {
    let combinedVars = Object.assign({}, templateVars || {}, transmissionVars || {})

    if (Object.keys(combinedVars).length === 0) {
      combinedVars = null
    }

    return combinedVars    
  }

  render(source, vars) {
    const template = Twig.twig({
      data: source
    })

    return template.render(vars)
  }
}
