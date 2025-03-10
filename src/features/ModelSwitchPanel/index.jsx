import { Icon } from '@lobehub/ui';
import { Dropdown } from 'antd';
import { createStyles } from 'antd-style';
import type { ItemType } from 'antd/es/menu/interface';
import { LucideArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PropsWithChildren, memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { ModelItemRender, ProviderItemRender } from '@/components/ModelSelect';
// import { useEnabledChatModels } from '@/hooks/useEnabledChatModels';
// import { useAgentStore } from '@/store/agent';
// import { agentSelectors } from '@/store/agent/slices/chat';
// import { EnabledProviderWithModels } from '@/types/aiModel';
import { withBasePath } from '@/utils/basePath';
import components from "@/locales/default/components";

const useStyles = createStyles(({ css, prefixCls }) => ({
  menu: css`
    .${prefixCls}-dropdown-menu-item {
      display: flex;
      gap: 8px;
    }
    .${prefixCls}-dropdown-menu {
      &-item-group-title {
        padding-inline: 8px;
      }

      &-item-group-list {
        margin: 0 !important;
      }
    }
  `,
  tag: css`
    cursor: pointer;
  `,
}));

const menuKey = (provider: string, model: string) => `${provider}-${model}`;

const ModelSwitchPanel = memo<PropsWithChildren>(({ children }) => {
  // const { t } = useTranslation('components');
  const { styles, theme } = useStyles();
  // const [model, provider, updateAgentConfig] = useAgentStore((s) => [
  //   agentSelectors.currentAgentModel(s),
  //   agentSelectors.currentAgentModelProvider(s),
  //   s.updateAgentConfig,
  // ]);
  const model = 'gpt-3.5'; // 静态模型值
  const provider = 'openai'; // 静态提供商值

  const router = useRouter();

  // const enabledList = useEnabledChatModels();
  const enabledList = [
    {
      id: 'openai',
      name: 'OpenAI',
      children: [
        { id: 'gpt-3.5', name: 'GPT-3.5' },
        { id: 'gpt-4', name: 'GPT-4' }
      ]
    }
  ];

  const items = useMemo<ItemType[]>(() => {
    // const getModelItems = (provider: EnabledProviderWithModels) => {
    //   const items = provider.children.map((model) => ({
    //     key: menuKey(provider.id, model.id),
    //     label: <ModelItemRender {...model} {...model.abilities} />,
    //     onClick: () => {
    //       updateAgentConfig({ model: model.id, provider: provider.id });
    //     },
    //   }));
    //
    //   // if there is empty items, add a placeholder guide
    //   if (items.length === 0)
    //     return [
    //       {
    //         key: 'empty',
    //         label: (
    //           <Flexbox gap={8} horizontal style={{ color: theme.colorTextTertiary }}>
    //             {t('ModelSwitchPanel.emptyModel')}
    //             <Icon icon={LucideArrowRight} />
    //           </Flexbox>
    //         ),
    //         onClick: () => {
    //           router.push(withBasePath('/settings/llm'));
    //         },
    //       },
    //     ];
    //
    //   return items;
    // };
    const getModelItems = (provider) => [
      {
        key: menuKey(provider.id, 'gpt-3.5'),
        label: <ModelItemRender id="gpt-3.5" name="GPT-3.5" />,
      },
      {
        key: menuKey(provider.id, 'gpt-4'),
        label: <ModelItemRender id="gpt-4" name="GPT-4" />,
      }
    ];
    // otherwise show with provider group
    return enabledList.map((provider) => ({
      children: getModelItems(provider),
      key: provider.id,
      label: <ProviderItemRender name={provider.name} provider={provider.id} />,
      type: 'group',
    }));
  }, [enabledList]);

  return (
    <Dropdown
      menu={{
        activeKey: menuKey(provider, model),
        className: styles.menu,
        items,
        style: {
          maxHeight: 500,
          overflowY: 'scroll',
        },
      }}
      placement={'topLeft'}
      trigger={['click']}
    >
      <div className={styles.tag}>{children}</div>
    </Dropdown>
  );
});

export default ModelSwitchPanel;
