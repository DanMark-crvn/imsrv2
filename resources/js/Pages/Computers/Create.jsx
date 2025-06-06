import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import { Link, useForm } from '@inertiajs/react';
import { Modal, Button, FileInput, Label, TextInput } from 'flowbite-react';
import { useState } from 'react';




const CreateModalComponent = ({ show, onClose, departmentsList, compUsersList, compUsersFnameList, generations }) => {
    if (!show) return null;

    const {data, setData, post, errors, reset} = useForm({
        comp_name: '',
        img_path: '',
        comp_model: '',
        comp_type: '',
        comp_user: '',
        department_comp: '',
        comp_os: '',
        comp_storage: '',
        comp_serial: '',
        comp_asset: '',
        asset_class: '',
        comp_cpu: '',
        comp_gen: '',
        comp_address: '',
        comp_prdctkey: '',
        comp_status: '',
        datePurchased: '',
        remarks: '',
    })
    const [imagePreview, setImagePreview] = useState(null);
    
    const [loading, setLoading] = useState(false);

    const onSubmit =(e) =>{
        e.preventDefault();
        setLoading(true);

        post(route("computers.store"), {
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
        setData("img_path", file);
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
        } else {
            setImagePreview(null);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50"> 
            <div
                className="absolute inset-0 bg-black opacity-50"
            ></div> {/* Backdrop */}
            <Modal show={show} onClose={onClose} className="" style={{ overflowY: 'scroll', scrollbarWidth: 'none'}}>
                <Modal.Header className="p-4">
                    Add New Computer
                </Modal.Header>
                <Modal.Body className=''>
                    <form action="" onSubmit={onSubmit}>
                        <div className="space-y-6">
                            <div className='flex justify-around'>
                                <div className='w-full p-3'>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="comp_name" value="Enter Computer Name" />
                                        </div>
                                        <TextInput
                                            id="comp_name"
                                            type='text'
                                            name='comp_name'
                                            value={data.comp_name}
                                            // placeholder=""
                                            // isFocused={true}
                                            onChange={(e) => setData("comp_name", e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.comp_name} className='mt-2' />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="comp_model" value="Enter Computer Model" />
                                        </div>
                                        <TextInput
                                            id="comp_model"
                                            type='text'
                                            name='comp_model'
                                            value={data.comp_model}
                                            // placeholder=""
                                            // isFocused={true}
                                            onChange={(e) => setData("comp_model", e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.comp_model} className='mt-2' />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="comp_type" value="Computer Type:" />
                                        </div>
                                        <SelectInput 
                                            name='comp_type' 
                                            id="comp_type" 
                                            onChange={(e) => setData("comp_type", e.target.value)}
                                            required 
                                        >
                                            <option value="">Select Type: </option>
                                            <option value="Desktop">Desktop</option>
                                            <option value="Laptop">Laptop</option>
                                        </SelectInput>
                                        <InputError message={errors.comp_type} className='mt-2' />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="comp_user" value="Choose User" />
                                        </div>
                                        <SelectInput 
                                            name='comp_user'
                                            id="comp_user" 
                                            value={data.comp_user}
                                            onChange={(e) => setData("comp_user", e.target.value)}
                                            required 
                                        >
                                            <option value="">Select User</option>
                                            {compUsersList.map(comp => (
                                                <option key={comp.CID} value={comp.initial}>
                                                    {comp.initial}
                                                </option>
                                            ))}
                                        </SelectInput>
                                        <InputError message={errors.comp_user} className='mt-2' />
                                    </div>

                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="fullName" value="Full Name" />
                                        </div>
                                        <SelectInput 
                                            name='fullName'
                                            id="fullName" 
                                            value={data.fullName}
                                            onChange={(e) => setData("fullName", e.target.value)}
                                            required 
                                        >
                                            <option value="">Select User</option>
                                            {compUsersFnameList.map(fname => (
                                                <option key={fname.CID} value={fname.name}>
                                                    {fname.name}
                                                </option>
                                            ))}
                                        </SelectInput>
                                        <InputError message={errors.fullName} className='mt-2' />
                                    </div>

                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="department_comp" value="Choose Department" />
                                        </div>
                                        <SelectInput 
                                            name='department_comp'
                                            id="department_comp" 
                                            value={data.department_comp}
                                            onChange={(e) => setData("department_comp", e.target.value)}
                                            required 
                                        >
                                            <option value="">Select Department</option>
                                            {departmentsList.map(dept => (
                                                <option key={dept.dept_id} value={dept.dept_list}>
                                                    {dept.dept_list}
                                                </option>
                                            ))}
                                        </SelectInput>
                                        <InputError message={errors.department_comp} className='mt-2' />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="comp_os" value="Enter Computer OS" />
                                        </div>
                                        <SelectInput 
                                            name='comp_os' 
                                            id="comp_os" 
                                            onChange={(e) => setData("comp_os", e.target.value)}
                                            required 
                                        >
                                            <option value="">Select Operating System: </option>
                                            <option value="Windows 7 Professional SP1">Windows 7 Professional SP1</option>
                                            <option value="Windows 8.1 Pro 64bit">Windows 8.1 Pro 64bit</option>
                                            <option value="Windows 10 Pro 64bit">Windows 10 Pro 64bit</option>
                                            <option value="Windows 11 Pro">Windows 11 Pro</option>
                                            <option value="N/A">N/A</option>
                                        </SelectInput>
                                        <InputError message={errors.comp_os} className='mt-2' />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="comp_storage" value="Enter Ram Capacity" />
                                        </div>
                                        <SelectInput 
                                            name='comp_storage' 
                                            id="comp_storage" 
                                            onChange={(e) => setData("comp_storage", e.target.value)}
                                            required 
                                        >
                                            <option value="">Select Ram Capacity: </option>
                                            <option value="1.5GB">1.5GB</option>
                                            <option value="2GB">2GB</option>
                                            <option value="4GB">4GB</option>
                                            <option value="6GB">6GB</option>
                                            <option value="8GB">8GB</option>
                                            <option value="12GB">12GB</option>
                                            <option value="16GB">16GB</option>
                                            <option value="32GB">32GB</option>
                                            <option value="N/A">N/A</option>
                                        </SelectInput>
                                        <InputError message={errors.comp_storage} className='mt-2' />
                                    </div>
                                </div>

                                <div className='w-full p-3'>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="comp_serial" value="Enter Computer Serial" />
                                        </div>
                                        <TextInput 
                                            id="comp_serial" 
                                            type="text"
                                            name='comp_serial' 
                                            value={data.comp_serial}
                                            onChange={(e) => setData("comp_serial", e.target.value)}
                                            required 
                                        />
                                        <InputError message={errors.comp_serial} className='mt-2' />
                                    </div>

                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="comp_asset" value="Enter Computer Asset" />
                                        </div>
                                        <TextInput 
                                            id="comp_asset" 
                                            type="text"
                                            name='comp_asset' 
                                            value={data.comp_asset}
                                            onChange={(e) => setData("comp_asset", e.target.value)}
                                            required 
                                        />
                                        <InputError message={errors.comp_asset} className='mt-2' />
                                    </div>

                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="asset_class" value="Asset Classification" />
                                        </div>
                                        <SelectInput 
                                            name='asset_class' 
                                            id="asset_class" 
                                            onChange={(e) => setData("asset_class", e.target.value)}
                                            required 
                                        >
                                            <option value="">Choose Asset Clasification: </option>
                                            <option value="Office Supplies">Office Supplies</option>
                                            <option value="Consumables">Consumables</option>
                                            <option value="Repair and Maintenance">Repair and Maintenance</option>
                                            <option value="Capital">Capital</option>
                                            <option value="N/A">N/A</option>
                                        </SelectInput>
                                        <InputError message={errors.asset_class} className='mt-2' />
                                    </div>
                                    
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="comp_cpu" value="Enter Computer Processor" />
                                        </div>
                                        <TextInput 
                                            id="comp_cpu" 
                                            type="text"
                                            name='comp_cpu' 
                                            value={data.comp_cpu}
                                            onChange={(e) => setData("comp_cpu", e.target.value)}
                                            required 
                                        />
                                        <InputError message={errors.comp_cpu} className='mt-2' />
                                    </div>
                                    
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="comp_gen" value="Computer Gen:" />
                                        </div>
                                        <SelectInput 
                                            name='comp_gen' 
                                            id="comp_gen" 
                                            onChange={(e) => setData("comp_gen", e.target.value)}
                                            required 
                                        >
                                            <option value="">Select Generation: </option>
                                            {generations.map((gen, index) => (
                                                <option key={index} value={gen}>{gen}</option>
                                            ))}
                                            {/* <option value="3rd">3rd</option>
                                            <option value="4th">4th</option>
                                            <option value="5th">5th</option>
                                            <option value="6th">6th</option>
                                            <option value="7th">7th</option>
                                            <option value="8th">8th</option>
                                            <option value="9th">9th</option>
                                            <option value="10th">10th</option>
                                            <option value="11th">11th</option>
                                            <option value="12th">12th</option>
                                            <option value="13th">13th</option>
                                            <option value="14th">14th</option>
                                            <option value="15th">15th</option>
                                            <option value="16th">16th</option>
                                            <option value="17th">17th</option>
                                            <option value="Pentium">Pentium</option>
                                            <option value="N/A">N/A</option> */}
                                        </SelectInput>
                                        <InputError message={errors.comp_gen} className='mt-2' />
                                    </div>

                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="comp_address" value="Enter Computer Address" />
                                        </div>
                                        <TextInput 
                                            id="comp_address" 
                                            type="text"
                                            name='comp_address' 
                                            value={data.comp_address}
                                            onChange={(e) => setData("comp_address", e.target.value)}
                                            required 
                                        />
                                        <InputError message={errors.comp_address} className='mt-2' />
                                    </div>

                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="comp_prdctkey" value="Enter Product Key" />
                                        </div>
                                        <TextInput 
                                            id="comp_prdctkey" 
                                            type="text"
                                            name='comp_prdctkey' 
                                            value={data.comp_prdctkey}
                                            onChange={(e) => setData("comp_prdctkey", e.target.value)}
                                            required 
                                        />
                                        <InputError message={errors.comp_prdctkey} className='mt-2' />
                                    </div>

                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="comp_status" value="Computer Status" />
                                        </div>
                                        <SelectInput 
                                            name='comp_status' 
                                            id="comp_status" 
                                            onChange={(e) => setData("comp_status", e.target.value)}
                                            required 
                                        >
                                            <option value="">Select Computer Status: </option>
                                            <option value="Deployed">Deployed</option>
                                            <option value="Spare">Spare</option>
                                            <option value="For Disposal">For Disposal</option>
                                            <option value="Already Disposed">Already Disposed</option>
                                            <option value="Borrow">Borrow</option>
                                        </SelectInput>
                                        <InputError message={errors.comp_status} className='mt-2' />
                                    </div>
                                    
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="datePurchased" value="Date Purchased: " />
                                        </div>
                                        <TextInput
                                            id="datePurchased"
                                            type='date'
                                            name='datePurchased'
                                            value={data.datePurchased}
                                            onChange={(e) => setData("datePurchased", e.target.value)}
                                        />
                                        <InputError message={errors.datePurchased} className='mt-2' />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="remarks" value="Remarks" />
                                </div>
                                <TextInput 
                                    id="remarks" 
                                    type="text"
                                    name='remarks' 
                                    value={data.remarks}
                                    onChange={(e) => setData("remarks", e.target.value)}
                                    required 
                                />
                                <InputError message={errors.remarks} className='mt-2' />
                            </div>
                            
                            <div className="flex-row w-full items-center justify-center">
                                <Label
                                    htmlFor="comp_img_path"
                                    className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                >
                                    <div className="flex flex-col items-center justify-center pb-6 pt-5">
                                        {
                                            imagePreview ? (
                                                <div className="mt-4">
                                                    <img src={imagePreview} alt="Image Preview" className="h-52 w-52 object-cover rounded-full" />
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
                                        id="comp_img_path" 
                                        name='img_path' 
                                        // onChange={(e) => setData("img_path", e.target.files[0])} 
                                        onChange={handleFileChange}
                                        className="hidden" 
                                    />
                                </Label>
                                <InputError message={errors.img_path} className='mt-2' />
                            </div>
                            <div className='flex justify-end'>
                                <Link href={route('computers.index')} className='bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2'>
                                    Cancel
                                </Link>
                                {/* <button className='bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600'>
                                    Submit
                                </button> */}
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
        </div>
    );
};

export default CreateModalComponent;