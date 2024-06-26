import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'
import type { ToolBarItemProps } from '../toolbar/Item.tsx'
import { ToolbarGroup } from '../toolbar/group.tsx'
import { flowShapes } from '../../shapes'
import { PanelView } from './panel-view.tsx'

interface IProps {
  children?: ReactNode[]
}

interface ITools extends React.FC<IProps> {
}

const DragPanel: ITools = ({ children }) => {
  const { t } = useTranslation()

  const toolsGroup: ToolBarItemProps[] = [
    {
      key: '1',
      title: t('translation:flow-chart'),
      icon: 'icon-topology',
      overlay: (
        <PanelView
          title={t('translation:flow-chart')}
          dragList={flowShapes}
          mode="flow"
        />
      ),
    },
    { key: '2', title: t('translation:resource'), icon: 'icon-server', overlay: <div>123</div> },
    { key: '3', title: t('translation:more'), icon: 'icon-more' },
  ]

  const defaultTools = (
    <Fragment>
      <ToolbarGroup
        group={toolsGroup}
        trigger={['click']}
        placement="rightTop"
      />
    </Fragment>
  )
  return (
    <div className="fiagram-tools vertical left-top">
      {children?.length ? children : defaultTools}
    </div>
  )
}

DragPanel.displayName = 'DragPanel'

export { DragPanel }
