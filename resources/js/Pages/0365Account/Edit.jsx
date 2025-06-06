import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import { Link, useForm } from '@inertiajs/react';
import { Modal, Button, FileInput, Label, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';



const EditModalComponent = ({ show, onClose, selectedEdit }) => {
    if (!show) return null;
    
    const {data, setData, post, errors, reset} = useForm({
        equipmentName: selectedEdit.equipmentName || "",
        managementIp: selectedEdit.managementIp || "",
        email: selectedEdit.email || "",
        password: selectedEdit.password || "",
        _method: 'PUT',
    });

    const [loading, setLoading] = useState(false);

    const onSubmit = (e) =>{
        e.preventDefault();
        setLoading(true);
        // console.log("Form Data:", data); // Add this line to log form data

        post(route("msAccount.update", selectedEdit && selectedEdit.id), {
            onSuccess: () => {
                // console.log("Update Successful"); 
                setLoading(false);
                onClose();
                reset();
            },
            onError: () => {
                // Handle errors if needed
                setLoading(false);
                // console.error(errors);
            }
        });
    }

    return (
        <Modal show={show} onClose={onClose }>
            <Modal.Header className="p-4">
                Edit - {selectedEdit && selectedEdit.email}
            </Modal.Header>
            <Modal.Body className=''>
                <form action="" onSubmit={onSubmit}>
                    {/* <pre className='bg-white'>{JSON.stringify(data, undefined, 2)}</pre> */}
                    <div className="space-y-6">                                                
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="email" value="Enter Email" />
                            </div>
                            <TextInput 
                                id="email" 
                                type="text"
                                name='email' 
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                required 
                            />
                            <InputError message={errors.email} className='mt-2' />
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

                        <div className='flex justify-end'>
                            <Link href={route('msAccount.index')} className='bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2'>
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

export default EditModalComponent;