import { ProjectDTO, useProjectService } from '@/core/services/project.service'
import { CellList } from '@/shared/components/cellList'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export const ProjectDetailView = () => {
    const { id } = useParams()
    const [projectDetail, setProjectDetail] = useState<ProjectDTO>()
    const projectService = useProjectService()

    useEffect(() => {
        projectService.getProjectDetail(id || '').subscribe((res) => {
            setProjectDetail(res.data)
        })
    }, [])
    return (
        <div className="bg-[#eff2fa] min-h-100vh">
            <div className="text-20px p-10px bg-[#fff]">项目详情</div>
            <div className="m-2">
                <CellList
                    data={projectDetail}
                    columns={[
                        { title: '项目名称', dataIndex: 'name' },
                        { title: '项目代码', dataIndex: 'projectCode' },
                        { title: '行业类别', dataIndex: 'classifyName' },
                        { title: '项目状态', dataIndex: 'statusName' },
                        { title: '建设性质', dataIndex: 'properties' },
                        { title: '项目阶段', dataIndex: 'projectStage' },
                        { title: '建设内容和规模', dataIndex: 'content' },
                        { title: '建设地点', dataIndex: 'place' },
                        { title: '建设开始年份', dataIndex: 'startYear' },
                        { title: '建设结束年份', dataIndex: 'endYear' },
                        { title: '项目所属年份', dataIndex: 'affiliationYear' },
                        { title: '投资主体', dataIndex: 'investmentEntityName' },
                        { title: '主管责任单位', dataIndex: 'governingOrgName' },
                        { title: '建设单位', dataIndex: 'buildOrg' },
                        { title: '领办（牵头）领导', dataIndex: 'inChargeMemberName' },
                        { title: '项目联系人', dataIndex: 'contacts' },
                        { title: '联系方式', dataIndex: 'contactsTel' },
                        { title: '项目标签', dataIndex: 'projectTagName' },
                        { title: '备注1', dataIndex: 'remarks1' },
                        { title: '备注2', dataIndex: 'remarks2' }
                    ]}
                ></CellList>
            </div>
        </div>
    )
}
