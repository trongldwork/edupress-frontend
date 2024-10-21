import React from 'react'
import { css } from '@emotion/react'
function BasePadding({children, paddingLeftRightPercent, backgroundColor}) {
  return (
    <div css={css`
        padding-left: ${paddingLeftRightPercent}%;
        padding-right: ${paddingLeftRightPercent}%;
        background-color: ${backgroundColor};
    `}>
        {children}
    </div>
  )
}

export default BasePadding