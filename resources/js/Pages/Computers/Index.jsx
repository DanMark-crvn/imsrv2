import Pagination from '@/Components/Pagination'
import SelectInput from '@/Components/SelectInput'
import TextInput from '@/Components/TextInput'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { COMPUTERS_STATUS_CLASS_MAP, COMPUTERS_STATUS_TEXT_MAP } from '@/constants'
import { Head, Link, router } from '@inertiajs/react'
import TableHeading from '@/Components/TableHeading'
import { Modal, Button } from 'flowbite-react';
import { useState } from 'react'

import useModal from './hooks/useModal'
import useCreateModal from './hooks/useCreateModal'
import useEditModal from './hooks/useEditModal'
import Show from './Show'
import CreateModalComponent from './Create'
import EditModalComponent from './Edit'

export default function Index({auth, computers, departmentsList, compUsersList, queryParams = null, success}) {
    
    queryParams = queryParams || {}
    const { showModal, selectedComp, openModal, closeModal } = useModal();
    const { showCreateModal, openCreateModal, closeCreateModal } = useCreateModal();
    const { showEditModal, selectedEditComp, openEditModal, closeEditModal } = useEditModal();
    const searchFieldChanged = (name, value) =>{
        if(value){
            queryParams[name] = value;
        }
        else{
            delete queryParams[name];
        }
        router.get(route('computers.index'), queryParams)
    };

    const onKeyPress = (name, e) => {
        if(e.key !== 'Enter') return;
        
        searchFieldChanged(name, e.target.value);
    }

    const sortChanged = (name) => {
        if(name === queryParams.sort_field){
            if(queryParams.sort_direction === 'asc'){
                queryParams.sort_direction = "desc";
            }
            else{
                queryParams.sort_direction = "asc";
            }
        }
        else{
            queryParams.sort_field = name;
            queryParams.sort_direction = 'asc';
        }
        router.get(route('computers.index'), queryParams)
    };

    const deleteComputers = (computer) => {
        if (!window.confirm('Are you sure you want to delete this employee?')) {
            return;
        }
        router.delete(route('computers.destroy', computer.CID))
    };    
    
  return (
    <AuthenticatedLayout
        user={auth.user}
        header={
            <div className='flex justify-between items-center'>
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">List of Computers</h2>
                <Button 
                    onClick={() => openCreateModal()} 
                    className='bg-emerald-500 text-white rounded shadow transition-all hover:bg-emerald-600'
                >
                    <span className='flex items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                        </svg>
                        Add
                    </span>
                </Button>
            </div>
        }
    >
        <Head title="Employees" />
        <div className="py-12">
                <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
                    {success && (
                        <div id="alert-border-3" className="flex items-center p-4 mb-4 text-green-800 border-t-4 border-green-300 bg-green-50 dark:text-green-400 dark:bg-gray-800 dark:border-green-800" role="alert">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <div className="ms-3 text-sm font-medium">
                                {success}
                            </div>
                            <button onClick={() => router.get(route('computers.index'))} type="button" className="ms-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"  data-dismiss-target="#alert-border-3" aria-label="Close">
                                <span className="sr-only">Dismiss</span>
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                            </button>
                        </div>
                    )}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* <pre>{JSON.stringify(computers, undefined, 2)}</pre> */}
                            <div className="overflow-auto">
                                <div className="flex justify-end py-2">
                                    <div>
                                        <TextInput 
                                            className="w-full"
                                            defaultValue={queryParams.comp_name} 
                                            placeholder="Computer Name"
                                            onBlur={e => searchFieldChanged('comp_name', e.target.value)}
                                            onKeyPress={ e => onKeyPress('comp_name', e)} 
                                        />
                                    </div>
                                </div>
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr className="text-nowrap">
                                            <TableHeading
                                                name="CID"
                                                sort_field={queryParams.sort_field} 
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                CID
                                            </TableHeading>
                                            <TableHeading
                                                name="comp_name"
                                                sort_field={queryParams.sort_field} 
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Computer Name
                                            </TableHeading>
                                            <th className="px-3 py-3">IMG</th>
                                            <TableHeading
                                                name="comp_model"
                                                sort_field={queryParams.sort_field} 
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Computer Model
                                            </TableHeading>
                                            <TableHeading
                                                name="comp_type"
                                                sort_field={queryParams.sort_field} 
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Computer Type
                                            </TableHeading>
                                            <TableHeading
                                                name="comp_user"
                                                sort_field={queryParams.sort_field} 
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                User
                                            </TableHeading>
                                            <TableHeading
                                                name="department_comp"
                                                sort_field={queryParams.sort_field} 
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Department
                                            </TableHeading>
                                            <TableHeading
                                                name="comp_os"
                                                sort_field={queryParams.sort_field} 
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Operating System
                                            </TableHeading>
                                            <TableHeading
                                                name="comp_storage"
                                                sort_field={queryParams.sort_field} 
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Computer Storage
                                            </TableHeading>
                                            <TableHeading
                                                name="comp_serial"
                                                sort_field={queryParams.sort_field} 
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Computer Serial
                                            </TableHeading>
                                            <TableHeading
                                                name="comp_asset"
                                                sort_field={queryParams.sort_field} 
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Computer Asset
                                            </TableHeading>
                                            <TableHeading
                                                name="comp_cpu"
                                                sort_field={queryParams.sort_field} 
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Processor
                                            </TableHeading>
                                            <TableHeading
                                                name="comp_gen"
                                                sort_field={queryParams.sort_field} 
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Computer Gen
                                            </TableHeading>
                                            <TableHeading
                                                name="comp_address"
                                                sort_field={queryParams.sort_field} 
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Mac Address
                                            </TableHeading>
                                            <TableHeading
                                                name="comp_prdctkey"
                                                sort_field={queryParams.sort_field} 
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Product Key
                                            </TableHeading>

                                            <TableHeading
                                                name="comp_status"
                                                sort_field={queryParams.sort_field} 
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Status
                                            </TableHeading>
                                            <TableHeading
                                                name="remarks"
                                                sort_field={queryParams.sort_field} 
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Remarks
                                            </TableHeading>
                                            <th className="px-3 py-3">Created By</th>
                                            <TableHeading
                                                name="created_at"
                                                sort_field={queryParams.sort_field} 
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Created Date
                                            </TableHeading>
                                            <th className="px-3 py-3 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr className="text-nowrap">
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3">
                                                <SelectInput 
                                                    className="w-full text-sm h-8 py-1"
                                                    defaultValue={queryParams.comp_status} 
                                                    onChange={ e => searchFieldChanged('comp_status', e.target.value)}
                                                >
                                                    <option value="">Select Status</option>
                                                    <option value="Deployed">Deployed</option>
                                                    <option value="Spare">Spare</option>
                                                    <option value="For Disposal">For Disposal</option>
                                                    <option value="Already Disposed">Already Disposed</option>
                                                    <option value="Barrow">Barrow</option>
                                                </SelectInput>
                                            </th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {computers.data ? (
                                                computers.data.map(computer => (
                                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={computer.CID}>
                                                        <td className="px-3 py-2">{computer.CID}</td>
                                                        <th className="px-3 py-2 hover:underline hover:text-white">
                                                            {/* <Link href={route("computers.show", { CID: computer.CID })}>
                                                                {computer.comp_name}
                                                            </Link> */}
                                                            <Link href="#" onClick={(e) => openModal(computer, e)}>
                                                                {computer.comp_name}
                                                            </Link>
                                                        </th>
                                                        <td className="px-3 py-2">
                                                            <img src={computer.img_path} alt="" style={{width: 60}} />
                                                        </td>
                                                        <td className="px-3 py-2">{computer.comp_model}</td>
                                                        <td className="px-3 py-2">{computer.comp_type}</td>
                                                        <td className="px-3 py-2">{computer.comp_user}</td>
                                                        <td className="px-3 py-2">{computer.department_comp}</td>
                                                        <td className="px-3 py-2">{computer.comp_os}</td>
                                                        <td className="px-3 py-2">{computer.comp_storage}</td>
                                                        <td className="px-3 py-2">{computer.comp_serial}</td>
                                                        <td className="px-3 py-2">{computer.comp_asset}</td>
                                                        <td className="px-3 py-2">{computer.comp_cpu}</td>
                                                        <td className="px-3 py-2">{computer.comp_gen}</td>
                                                        <td className="px-3 py-2">{computer.comp_address}</td>
                                                        <td className="px-3 py-2">{computer.comp_prdctkey}</td>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            <span className={'px-2 rounded-e-full text-white ' + COMPUTERS_STATUS_CLASS_MAP[computer.comp_status]}>{COMPUTERS_STATUS_TEXT_MAP[computer.comp_status]}</span>
                                                        </td>
                                                        <td className="px-3 py-2">{computer.remarks}</td>
                                                        <td className="px-3 py-2">{computer.createdBy.name}</td>
                                                        <td className="px-3 py-2 text-nowrap">{computer.created_at}</td>
                                                        <td className="px-3 py-2 text-right text-nowrap">
                                                            {/* <Link href={route('computers.edit', computer.CID)} className="font-medium inline-block py-1 px-2 rounded-lg  text-white  bg-blue-600 hover:bg-blue-700 mx-1">Edit</Link> */}
                                                            <button
                                                                className="inline-block py-1 px-2  text-blue-500 hover:text-blue-300 hover:scale-110 hover:animate-spin mx-1"
                                                                onClick={(e) => openModal(computer, e)}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                className="inline-block py-1 px-2  text-blue-500 hover:text-blue-300 hover:scale-110 hover:animate-spin mx-1" 
                                                                onClick={() => openEditModal(computer)}
                                                            >
                                                                <span className='flex items-center justify-center'>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                                    </svg>
                                                                </span>
                                                            </button>
                                                            <button 
                                                                onClick={(e) => deleteComputers(computer)}
                                                                className="inline-block py-1 px-2 text-red-500 hover:text-red-700 hover:scale-110 hover:animate-bounce mx-1"
                                                            >
                                                                <span className='flex items-center justify-center'>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                                    </svg>
                                                                </span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="17">No data available</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <Pagination links={computers.meta.links} />
                        </div>
                    </div>
                </div>
            </div>
            <Show show={showModal} onClose={closeModal} user={selectedComp} />
            <CreateModalComponent show={showCreateModal} onClose={closeCreateModal} departmentsList={departmentsList.data} compUsersList={compUsersList.data}  />
            <EditModalComponent 
                show={showEditModal} 
                onClose={closeEditModal} 
                listDepartments={departmentsList.data}
                listCompUsers={compUsersList.data}
                // accountUsersEdit={computers}
                selectedEditComp={selectedEditComp}
            />
    </AuthenticatedLayout>
  )
}
