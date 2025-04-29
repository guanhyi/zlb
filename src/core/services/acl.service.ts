import { BehaviorSubject, Observable } from 'rxjs'
import { ACLType } from './acl.type'
import { useDependency } from '@wendellhu/redi/react-bindings'

export class ACLService {
    private aclChange = new BehaviorSubject<Array<ACLType>>([])
    /** ACL变更通知 */
    get change(): Observable<Array<ACLType>> {
        return this.aclChange.asObservable()
    }

    private abilities: Array<ACLType> = [2]

    /**
     * 更新权限点
     * @param abilities 权限点数组
     */
    setAbilities(abilities: ACLType[]) {
        this.abilities = abilities
        this.aclChange.next(abilities)
    }

    /**
     * 检查权限点是否在数组
     */
    canAbilities(abilities: ACLType): boolean {
        return this.abilities.includes(abilities)
    }

    get data() {
        return {
            abilities: this.abilities
        }
    }
}

export const useAclService = () => {
    const aclService = useDependency(ACLService)

    return {
        ...aclService
    }
}
