import cx from 'classnames';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Form, Input, Select, Tooltip, Button } from 'antd';

import { useTranslation } from 'react-i18next';

import { Setting } from '@leaa/common/src/entrys';
import { messageUtil } from '@leaa/dashboard/src/utils';
import { IOnValidateFormResult } from '@leaa/dashboard/src/interfaces';
import { UpdateSettingsInput } from '@leaa/common/src/dtos/setting';

import { FormCard, Rcon } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  items?: Setting[];
  loading?: boolean;
  onClickLabelEditCallback: (setting: Setting) => void;
  className?: string;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

export const buildTypeDom = (setting: Pick<Setting, 'type' | 'name' | 'options'>) => {
  let dom = <span>----</span>;

  const { type, name, options } = setting;

  if (type === 'input') {
    dom = <Input placeholder={name} />;
  }

  if (['radio'].includes(type)) {
    dom = (
      <Select>
        {options &&
          options.split(/[\n]/).map((option: string) => (
            <Select.Option key={option} value={option}>
              {option}
            </Select.Option>
          ))}
      </Select>
    );
    // dom = <Input.TextArea placeholder={name} rows={3} />;
  }

  if (['checkbox', 'textarea'].includes(type)) {
    dom = <Input.TextArea placeholder={name} rows={3} />;
  }

  return dom;
};

export const SettingListForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const buildLabelDom = (setting: Setting) => {
    return (
      <span>
        <Tooltip
          title={
            <>
              <Rcon type="ri-question-line" /> {setting.description}
            </>
          }
          trigger="hover"
        >
          <Button
            size="small"
            type="link"
            onClick={() => props.onClickLabelEditCallback(setting)}
            className={cx(style['label-button'])}
          >
            <Rcon type="ri-edit-2-line" className={style['label-icon']} />
            <strong className={cx(style['label-text'])}>
              {setting.private ? <Rcon type="ri-lock-2-line" className={style['private-icon']} /> : null}
              {setting.name}
            </strong>
          </Button>
        </Tooltip>
      </span>
    );
  };

  const onValidateForm = async (): IOnValidateFormResult<UpdateSettingsInput[]> => {
    try {
      const result = await form.validateFields();

      return Object.keys(result).map(k => ({ id: Number(k), value: result[k] }));
    } catch (error) {
      return messageUtil.error(error.errorFields[0]?.errors[0]);
    }
  };

  const onUpdateForm = (items?: Setting[]) => {
    if (!items) return undefined;

    return items.forEach(item => {
      form.setFields([{ name: item.id, value: item.value }]);
    });
  };

  useEffect(() => {
    onUpdateForm(props.items);
  }, [props.items]);

  useImperativeHandle(ref, () => ({ form, onValidateForm }));

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <FormCard>
        <Form form={form} layout="vertical" hideRequiredMark {...formItemLayout}>
          {props.items?.map(item => (
            <div key={item.id}>
              <Form.Item name={item.id} rules={[{ required: true }]} label={buildLabelDom(item)}>
                {buildTypeDom(item)}
              </Form.Item>
            </div>
          ))}
        </Form>
      </FormCard>
    </div>
  );
});
