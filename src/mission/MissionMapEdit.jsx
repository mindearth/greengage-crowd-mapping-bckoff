import {
    Button,
    Checkbox,
    Col,
    Divider,
    Drawer,
    Form,
    Input,
    InputNumber,
    Radio,
    Row,
    Select,
    Space,
    Switch,
    TimePicker
} from "antd";
import {useState} from "react";
import dayjs from "dayjs";
import TextArea from "antd/lib/input/TextArea.js";
import {weekDays} from "../core/utils.js";

export function MissionMapEdit({
                                   drawerIsOpen,
                                   closeDrawer,
                                   editData
                               }) {
    const [isLoading, setIsLoading] = useState(false);
    const [timeConstraintIsEnabled, setTimeConstraintIsEnabled] = useState(true);
    const [form] = Form.useForm();
    const format = 'HH:mm';
    const dateFormat = 'YYYY/MM/DD';

    async function submit(values) {
    }

    function btnSubmit() {
        form.submit()
    }

    function onChangeTimeConstraintCheckAllDay(value) {
        setTimeConstraintIsEnabled(value)

        if (value) {
            form.setFieldValue('timeConstraint', [
                dayjs().hour(0).minute(0),
                dayjs().hour(23).minute(59)
            ])
        }
    }

    return (

        <Drawer
            title="Save mission"
            width={800}
            onClose={() => closeDrawer(false)}
            open={drawerIsOpen}
            closeIcon={false}
            extra={
                <Space>
                    <Button onClick={closeDrawer}>Cancel</Button>
                    <Button
                        onClick={btnSubmit}
                        type="primary" loading={isLoading}>
                        Save
                    </Button>
                </Space>
            }
        >

            <Form
                form={form}
                onFinish={submit}
                disabled={isLoading}
                layout="vertical"
                initialValues={editData
                    ? {
                        enabled: editData.enabled,
                        name: editData.name,
                        description: editData.description,
                        duration: [
                            dayjs(editData.dateStart, dateFormat),
                            dayjs(editData.dateEnd, dateFormat)
                        ]
                    }
                    : {
                        enabled: true,
                        client: null,
                        name: null,
                        kind: null,
                        description: null,
                        duration: 15,
                        distance: 1000,
                        reward: 1,
                        weekDayConstraint: 'all',
                        timeConstraint: [
                            dayjs().hour(0).minute(0),
                            dayjs().hour(23).minute(59)]

                    }}
                    >
                <Form.Item
                    style={{
                        textAlign: 'end',
                        marginBottom: 0,
                        paddingBottom: 0,
                    }}
                    name="enabled"
                    label=""
                    valuePropName="checked">

                    <Switch
                        checkedChildren="enabled"
                        unCheckedChildren="disabled"
                    />

                </Form.Item>
                <Row gutter={16}>
                    <Col span={20}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter a valid name',
                                },
                            ]}
                        >
                            <Input placeholder="Please enter name"/>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                            name="kind"
                            label="Kind"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select a type',
                                },
                            ]}>
                            <Select
                                allowClear
                                options={[
                                    {
                                        value: 'walk',
                                        label: 'walk',
                                    },
                                    {
                                        value: 'spot',
                                        label: 'spot',
                                    },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    name="description"
                    label="Description"
                >
                    <TextArea
                        placeholder="Please enter descritpion"
                        autoSize={{minRows: 3, maxRows: 5}}
                    />
                </Form.Item>

                <Form.Item
                    name="mapper"
                    label="Assaing to"
                >
                    <Input placeholder="Please enter mapper"/>

                </Form.Item>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="duration"
                            label="Duration"
                        >
                            <InputNumber
                                style={{width: 130}}
                                min={1}
                                max={45}
                                addonAfter="minute"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="distance"
                            label="Distance"
                        >
                            <InputNumber
                                style={{width: 140}}
                                min={1}
                                max={3000}
                                step={100}
                                addonAfter="meter"/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="reward"
                            label="Reward"
                        >
                            <InputNumber
                                style={{width: 120}}
                                min={0}
                                max={30}
                                addonAfter="Euro"/>
                        </Form.Item>
                    </Col>
                </Row>

                <Divider orientation="right">Date time constraint</Divider>

                <Form.Item
                    name="weekDayConstraint"
                    label="Day of the week it is available"
                >
                    <Radio.Group
                        options={weekDays()}
                        optionType="button"
                        buttonStyle="solid"
                    />
                </Form.Item>

                <Row wrap={false}>
                    <Col flex="none">
                        <Form.Item
                            name="timeConstraint"
                            label="Time slot in which it is available"

                        >
                            <TimePicker.RangePicker
                                format={format}
                                minuteStep={10}
                                disabled={timeConstraintIsEnabled}
                            />

                        </Form.Item>
                    </Col>
                    <Col flex="auto">
                        <Form.Item
                            name="timeConstraintCheckAllday"
                            label="  "
                            style={{marginLeft: 10}}
                        >
                            <Checkbox
                                onChange={(e) => onChangeTimeConstraintCheckAllDay(e.target.checked)}
                                defaultChecked={true}>All day</Checkbox>

                        </Form.Item>
                    </Col>
                </Row>

            </Form>
        </Drawer>
    )
}