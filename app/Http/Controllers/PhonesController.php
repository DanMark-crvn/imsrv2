<?php

namespace App\Http\Controllers;

use App\Http\Resources\AccountUsersResource;
use App\Http\Resources\DepartmentsResource;
use App\Http\Resources\PhonesResource;
use App\Models\AccountUsers;
use App\Models\Departments;
use App\Models\Phones;
use App\Http\Requests\StorePhonesRequest;
use App\Http\Requests\UpdatePhonesRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PhonesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $query = Phones::query();

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        // if(request("phone_name")){
        //     $query->where("phone_name","like","%". request("phone_name") .'%');
        // }
        if ($search = request('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('phone_name', 'like', '%' . $search . '%')
                  ->orWhere('fullName', 'like', '%' . $search . '%');
            });
        }

        if(request('phone_status')){
            $query->where('phone_status', request('phone_status'));
        }

        $phones = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)->onEachSide(1);

        $departmentsList = Departments::orderBy('dept_list')->get(); // Fetch all departments
        $phoneUsersFnameList = AccountUsers::orderBy('name')->get();
        $phonesAllData = Phones::orderBy('phone_id')->get();

        // echo $phonesAllData;

        return inertia("Phones/Index", [
            'phones' => PhonesResource::collection($phones),
            'departmentsList' => DepartmentsResource::collection($departmentsList),
            'phoneUsersFnameList' => AccountUsersResource::collection($phoneUsersFnameList),
            'phonesAllData' => PhonesResource::collection($phonesAllData),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePhonesRequest $request)
    {
        //
        $data = $request->validated();
        /** @var $img_path \Illuminate\Http\UploadedFile */
        $img_path = $data['img_path'] ?? null;
        $data['created_by'] = Auth::id(); 
        $data['updated_by'] = Auth::id();
        if($img_path){
            $data['img_path'] = $img_path->store('Phones/'.Str::random(), 'public');
        }

        //?Checking if there's a data is posted after submission 
        // dd($data);

        //*This is for passing the data to create a new Phone
        Phones::create($data);

        return to_route('phones.index')->with('success', 'New Phone was created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Phones $phones)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Phones $phones)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePhonesRequest $request, Phones $phone)
    {
        //
        $data = $request->validated();
        // \Log::info('Update data: ', $data);

        // Handle img_path if it exists
        $img_path = $request->file('img_path');

        if($img_path){
            if($phone->img_path){
                Storage::disk('public')->deleteDirectory(dirname($phone->img_path));
            }
            $data['img_path'] = $img_path->store('Phones/'.Str::random(), 'public');
        } else {
            unset($data['img_path']);
        }

        // dd($data);
        $data['updated_by'] = Auth::id();
        $phone->update($data);
        // \Log::info('Updated phone: ', $phones->toArray());
        return to_route('phones.index')->with('success', "Phone \" $phone->phone_name\" was updated");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Phones $phone)
    {
        //
        $phone->delete();
        if($phone->img_path){
            Storage::disk('public')->deleteDirectory(dirname($phone->img_path));
        }
        return to_route('phones.index')->with('success', "Phone - \" $phone->phone_name\" successfully deleted!");
    }
}
