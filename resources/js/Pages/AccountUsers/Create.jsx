import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import { Link, useForm } from '@inertiajs/react';
import { Modal, Button, FileInput, Label, TextInput } from 'flowbite-react';
import { useState } from 'react';




const CreateModalComponent = ({ show, onClose, departmentsList }) => {
    if (!show) return null;

    const {data, setData, post, errors, reset} = useForm({
        name: '',
        department_users: '',
        initial: '',
        outlookEmail: '',
        password: '',
        satus: '',
        profile_path: '',
    })
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);


    const onSubmit =(e) =>{
        e.preventDefault();
        setLoading(true);

        post(route("accountUsers.store"), {
            onSuccess: () => {
                setLoading(false);
                onClose();
                reset();
            },
            onError: () => {
                setLoading(false);
            }
        });
    }
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData("profile_path", file);
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
        } else {
            setImagePreview(null);
        }
    };

    return (
        <Modal show={show} onClose={onClose }>
            <Modal.Header className="p-4">
                Add New Employee
            </Modal.Header>
            <Modal.Body className=''>
                <form action="" onSubmit={onSubmit}>
                    <div className="space-y-6">
                        {/* <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h3> */}
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="name" value="Enter Full Name" />
                            </div>
                            <TextInput
                                id="name"
                                type='text'
                                name='name'
                                value={data.name}
                                // placeholder=""
                                // isFocused={true}
                                onChange={(e) => setData("name", e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className='mt-2' />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="department_users" value="Choose Department" />
                            </div>
                            <SelectInput 
                                name='department_users'
                                id="department_users" 
                                value={data.department_users}
                                onChange={(e) => setData("department_users", e.target.value)}
                                required 
                            >
                                <option value="">Select Department</option>
                                {departmentsList.map(dept => (
                                    <option key={dept.dept_id} value={dept.dept_list}>
                                        {dept.dept_list}
                                    </option>
                                ))}
                            </SelectInput>
                            <InputError message={errors.department_users} className='mt-2' />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="initial" value="Enter Initial" />
                            </div>
                            <TextInput 
                                id="initial" 
                                type="text"
                                name='initial' 
                                value={data.initial}
                                onChange={(e) => setData("initial", e.target.value)}
                                required 
                            />
                            <InputError message={errors.initial} className='mt-2' />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="outlookEmail" value="Enter Email" />
                            </div>
                            <TextInput 
                                id="outlookEmail" 
                                type="text"
                                name='outlookEmail' 
                                value={data.outlookEmail}
                                onChange={(e) => setData("outlookEmail", e.target.value)}
                                required 
                            />
                            <InputError message={errors.outlookEmail} className='mt-2' />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="password" value="Enter Password" />
                            </div>
                            <TextInput 
                                id="password" 
                                type="text"
                                name='password' 
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                required 
                            />
                            <InputError message={errors.password} className='mt-2' />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="status" value="Status" />
                            </div>
                            <SelectInput 
                                name='status' 
                                id="status" 
                                onChange={(e) => setData("status", e.target.value)}
                                required 
                            >
                                <option value="">Select Status: </option>
                                <option value="Employed">Employed</option>
                                <option value="Resigned">Resigned</option>
                                <option value="Terminated">Terminated</option>
                            </SelectInput>
                            <InputError message={errors.status} className='mt-2' />
                        </div>

                        <div className="flex-row w-full items-center justify-center">
                            <Label
                                htmlFor="accountusers_profile_path"
                                className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                            >
                                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                                    {
                                        imagePreview ? (
                                            <div className="mt-4">
                                                <img src={imagePreview} alt="Profile Preview" className="h-52 w-52 object-cover rounded-full" />
                                            </div>
                                        ) : (
                                        <div className='flex flex-col items-center justify-center'>
                                            <svg
                                                className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 20 16"
                                            >
                                                <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                />
                                            </svg>
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                        </div>
                                        )
                                    }
                                    {/* {imagePreview && (
                                        <div className="mt-4">
                                            <img src={imagePreview} alt="Profile Preview" className="h-32 w-32 object-cover rounded-full" />
                                        </div>
                                    )} */}
                                </div>
                                <FileInput 
                                    id="accountusers_profile_path" 
                                    name='profile_path' 
                                    // onChange={(e) => setData("profile_path", e.target.files[0])} 
                                    onChange={handleFileChange}
                                    className="hidden" 
                                />
                            </Label>
                            <InputError message={errors.profile_path} className='mt-2' />
                        </div>
                        <div className='flex justify-end'>
                            <Link href={route('accountUsers.index')} className='bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2'>
                                Cancel
                            </Link>
                            <button 
                                type="submit" 
                                className={`bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-600'}`} 
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 1 1 8 8A8 8 0 0 1 4 12z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    'Submit'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onClose} color="blue">
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateModalComponent;