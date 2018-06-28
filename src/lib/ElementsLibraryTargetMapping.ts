import Target from './Target'
import ElementsLibrary from './ElementsLibrary'
import Teleport from '../Teleport'
import TeleportLight from '../TeleportLight';

export default class ElementsLibraryTargetMapping {
  private _teleport: Teleport | TeleportLight
  public name: string
  public version: string
  public type: string
  public library: string | ElementsLibrary
  public target: string | Target
  public extends: string | ElementsLibraryTargetMapping
  public maps: object = {}

  constructor(libraryMappingDefinition: object, instance: Teleport | TeleportLight) {
    this._teleport = instance
    Object.assign(this, libraryMappingDefinition)
  }

  /**
   * sets the target of the current mapping
   * @param target
   */
  public setTarget(target: Target): void {
    this.target = target

    // compute the extended map if there is one
    if (this.extends) {
      const extendedMapping = this._teleport.mapping(this.extends as string)
      // tslint:disable-next-line:max-line-length
      if (!extendedMapping) throw new Error(`Mapping '${this.name}' depends on '${this.extends}' which was not yet registered for target '${this.target.name}' Please register it before the current one`)

      this.extends = extendedMapping

      this.maps = {
        ...this.extends.maps,
        ...this.maps
      }
    }
  }

  /**
   * sets the libraryb if the current mapping
   * @param library
   */
  public setLibrary(library: ElementsLibrary): void {
    this.library = library
  }

  /**
   * applies data from a generic object
   * @param libData
   */
  private applyData(libData: object): void {
    Object.assign(this, libData)
  }

  /**
   * retrieves the mapping of a specific element for the current target mapping
   * @param type
   */
  public map(type: string): object | null {
    return this.maps[type]
  }
}
