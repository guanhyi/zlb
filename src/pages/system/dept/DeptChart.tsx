import styled from 'styled-components'
import { Tree, TreeNode } from 'react-organizational-chart'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { SysDeptService, SysDeptVO } from '@/core/services/system/SysDeptService'
//@ts-ignore
import OrgTree from 'react-org-tree'

import { theme } from 'antd'
import Color from 'color'
const { useToken } = theme

const ChangeDept = (node: SysDeptVO[]) => {
    return node.map((item) => {
        let newItem = {
            ...item,
            label: item.name
        }

        if (item.children) {
            newItem.children = ChangeDept(item.children)
        }

        return newItem
    })
}

export const DeptChart = () => {
    const sysDeptService = useDependency(SysDeptService)
    const { token } = useToken()

    return (
        <OrgTree
            // horizontal
            expand={true}
            collapsable={true}
            data={{
                id: 0,
                label: '丽水市',
                children: ChangeDept(sysDeptService.Depts.value)
            }}
        />
    )

    // return (
    //     <Tree
    //         lineWidth="1px"
    //         lineBorderRadius="24px"
    //         lineColor={token.colorPrimaryBorder}
    //         label={
    //             <StyledNode
    //                 $textColor={token.colorPrimaryTextActive}
    //                 $backgroundColor={Color(token.colorPrimary).alpha(0.08).toString()}
    //                 $borderColor={Color(token.colorPrimaryBorder).alpha(0.24).toString()}
    //             >
    //                 丽水市
    //             </StyledNode>
    //         }
    //     >
    //         {sysDeptService.Depts.value?.map((org) => (
    //             <DeptTreeNode key={org.id} node={org} />
    //         ))}
    //     </Tree>
    // )
}

function DeptTreeNode({ node }: { node: SysDeptVO }) {
    const { token } = useToken()
    return (
        <TreeNode
            label={
                <StyledNode
                    $textColor={token.colorPrimaryTextActive}
                    $backgroundColor={Color(token.colorPrimary).alpha(0.08).toString()}
                    $borderColor={Color(token.colorPrimaryBorder).alpha(0.24).toString()}
                >
                    {node.name}
                </StyledNode>
            }
        >
            {node.children?.map((org) => (
                <DeptTreeNode key={org.id} node={org} />
            ))}
        </TreeNode>
    )
}

type StyledNodeProps = {
    $textColor: string
    $backgroundColor: string
    $borderColor: string
}
const StyledNode = styled.div<StyledNodeProps>`
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    overflow: hidden;
    position: relative;
    z-index: 0;
    padding: 16px;
    border-radius: 12px;
    display: inline-flex;
    text-transform: capitalize;
    color: ${(props) => props.$textColor};
    background-color: ${(props) => props.$backgroundColor};
    border: 1px solid ${(props) => props.$borderColor};
`
