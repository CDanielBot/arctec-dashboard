import React, { useState } from 'react'
import { PieChart, Pie, Sector } from 'recharts'
import styled from 'styled-components'

const renderActiveShape = (props, text) => {
  const RADIAN = Math.PI / 180
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value
  } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${text} ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  )
}

const Statistics = ({ projects, employeesList }) => {
  const [projectsActiveIndex, setProjectsActiveIndex] = useState(0)
  const [employeesActiveIndex, setEmployeesActiveIndex] = useState(0)

  let projectsData = []
  let employeesData = []

  const projectManagersCount = employeesList.filter(
    employee => employee.jobPosition === 'Project Manager'
  )

  const developersCount = employeesList.filter(employee => employee.jobPosition === 'Developer')

  projects.map(project => {
    if (project.active) {
      return projectsData.push({
        name: project.name,
        value: Object.keys(project.team).length + 1
      })
    }
    return null
  })

  employeesData.push(
    { name: 'Project Managers', value: projectManagersCount.length },
    { name: 'Developers', value: developersCount.length }
  )

  const onEmployeesPieEnter = (data, index) => {
    setEmployeesActiveIndex(index)
  }

  const onProjectsPieEnter = (data, index) => {
    setProjectsActiveIndex(index)
  }

  return (
    <Container>
      <PieChart width={500} height={300}>
        <Pie
          activeIndex={employeesActiveIndex}
          activeShape={e => renderActiveShape(e, 'Ammount: ')}
          data={employeesData}
          cx={'50%'}
          cy={'50%'}
          innerRadius={80}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={onEmployeesPieEnter}
        />
      </PieChart>

      <PieChart width={500} height={300}>
        <Pie
          activeIndex={projectsActiveIndex}
          activeShape={e => renderActiveShape(e, 'Developers: ')}
          data={projectsData}
          cx={'50%'}
          cy={'50%'}
          innerRadius={80}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={onProjectsPieEnter}
        />
      </PieChart>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  position: fixed;
`

export default Statistics
