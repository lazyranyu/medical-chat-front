import { memo, useEffect } from 'react';

import { BRANDING_NAME } from '@/const/branding';
import PropTypes from "prop-types";

const PageTitle = memo(({ title }) => {
  useEffect(() => {
    document.title = title ? `${title} · ${BRANDING_NAME}` : BRANDING_NAME;
  }, [title]);
  return null;
});

// 添加 prop 类型校验
PageTitle.propTypes = {
  title: PropTypes.string
};

export default PageTitle;
