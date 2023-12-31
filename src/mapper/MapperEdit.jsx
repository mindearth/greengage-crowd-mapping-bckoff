import {useAuth} from "react-oidc-context";
import {useEffect, useState} from "react";
import {Button, Drawer, Form, Input, Radio, Space, Switch} from "antd";
import {updateMapper} from "./MapperService.js";

export function MapperEdit({
                               drawerIsOpen,
                               closeDrawer,
                               editData
                           }) {
    const auth = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    function btnSubmit() {
        form.submit()
    }

    async function submit(values) {

        setIsLoading(true)

        editData
            ? await updateMapper(auth.user.access_token, {
                id: editData.id,
                name: values.name,
                surname: values.surname,
                acceptedTerms: values.acceptedTerms === true,
                enable: values.enable === true,
            })
            : "Not implemented"

        closeDrawer(true)
    }

    useEffect(() => {

        form.resetFields()
        setIsLoading(false)
    }, [drawerIsOpen]);

    return (
        <Drawer
            title={editData ? "Modify mapper" : "Create a new mapper"}
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
                        username: editData.username,
                        name: editData.name,
                        surname: editData.surname,
                        acceptedTerms: editData.acceptedTerms
                    }
                    : {
                        enable: true,
                        username: '',
                        name: '',
                        surname: '',
                        acceptedTerms: false
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
                    name="username"
                    label="Username"
                    disabled={true}
                >
                    <Input placeholder="Please enter name" disabled={true}/>
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
                    name="surname"
                    label="Last name"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter a valid last name',
                        },
                    ]}
                >
                    <Input placeholder="Please enter last name"/>
                </Form.Item>

                <Form.Item
                    name="acceptedTerms"
                    label="Accepted Terms">
                    <Radio.Group
                        options={[
                            {label: 'Yes', value: true},
                            {label: 'No', value: false},
                        ]}
                        optionType="button"
                        buttonStyle="solid"
                    />
                </Form.Item>
            </Form>

        </Drawer>
    )
}