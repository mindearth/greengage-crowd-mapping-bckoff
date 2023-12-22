import {Button, DatePicker, Drawer, Form, Input, Space, Switch, Typography} from "antd";
import {useEffect, useState} from "react";
import TextArea from "antd/lib/input/TextArea.js";
import dayjs from 'dayjs';
import {insertCampaign, updateCampaign} from "./CampaignService.js";
import {useAuth} from "react-oidc-context";

const {Text} = Typography;
const {RangePicker} = DatePicker;

export function CampaignEdit({
                                 drawerIsOpen,
                                 closeDrawer,
                                 editData
                             }) {
    const auth = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [clients, setClients] = useState([]);
    const [form] = Form.useForm();
    const dateFormat = 'YYYY/MM/DD';

    function btnSubmit() {
        form.submit()
    }

    async function submit(values) {

        setIsLoading(true)

        editData
            ? await updateCampaign(auth.user.access_token, {
                id: editData.id,
                name: values.name,
                description: values.description,
                enable: values.enable === true,
                dateStart: dayjs(values.duration[0]).format('YYYY-MM-DD'),
                dateEnd: dayjs(values.duration[1]).format('YYYY-MM-DD')
            })
            : await insertCampaign(auth.user.access_token, {
                id: 0,
                name: values.name,
                description: values.description,
                enable: values.enable === true,
                dateStart: dayjs(values.duration[0]).format('YYYY-MM-DD'),
                dateEnd: dayjs(values.duration[1]).format('YYYY-MM-DD')
            })

        closeDrawer(true)
    }

    useEffect(() => {

        form.resetFields()
        setIsLoading(false)
    }, [drawerIsOpen]);

    return (
        <Drawer
            title={editData ? "Modify campaign" : "Create a new campaign"}
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
                        enable: editData.enable,
                        name: editData.name,
                        description: editData.description,
                        duration: [
                            dayjs(editData.dateStart, dateFormat),
                            dayjs(editData.dateEnd, dateFormat)
                        ]
                    }
                    : {
                        enable: true,
                        client: null,
                        name: null,
                        description: null,
                        duration: [dayjs(), null]

                    }}>

                <Form.Item
                    style={{
                        textAlign: 'end',
                        marginBottom: 0,
                        paddingBottom: 0,
                    }}
                    name="enable"
                    label=""
                    valuePropName="checked">

                    <Switch
                        checkedChildren="enable"
                        unCheckedChildren="disabled"
                    />

                </Form.Item>
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
                    name="duration"
                    label="Duration"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter a valid value',
                        },
                    ]}
                >
                    <RangePicker format="DD/MM/YYYY"/>
                </Form.Item>

            </Form>
        </Drawer>
    )
}