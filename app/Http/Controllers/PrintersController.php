<?php

namespace App\Http\Controllers;

use App\Http\Resources\AccountUsersResource;
use App\Http\Resources\DepartmentsResource;
use App\Http\Resources\PrintersResource;
use App\Models\AccountUsers;
use App\Models\Departments;
use App\Models\Printers;
use App\Http\Requests\StorePrintersRequest;
use App\Http\Requests\UpdatePrintersRequest;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class PrintersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $query = Printers::query();

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        $printers = $query
            ->with(['createdBy', 'updatedBy']) // eto yung kulang mo
            ->orderBy($sortField, $sortDirection)
            ->when(request('search'), function (Builder $query, $search) {
                $search = (string)$search;
                $query->where('printer_user', 'like', "%{$search}%")
                    ->orWhere('printer_model', 'like', "%{$search}%")
                    ->orWhere('printer_serial', 'like', "%{$search}%")
                    ->orWhere('printer_asset', 'like', "%{$search}%");
            })
            ->when(request('asset_class'), function (Builder $query, $assetClass) {
                $query->where('asset_class', $assetClass);
            })
            ->when(request('printer_department'), function (Builder $query, $deptPrinter) {
                $query->where('printer_department', $deptPrinter);
            })
            ->paginate(10)->onEachSide(1);
        //end

        $departmentsList = Departments::orderBy('dept_list')->get(); // Fetch all departments
        $printerUsersList = AccountUsers::orderBy('name')->get();
        $printersAllData = Printers::orderBy('printer_id')->get();
        // $compNameList = Computers::orderBy('comp_name')->get();

        // echo $printersAllData;

        return inertia("Printers/Index", [
            'printers' => PrintersResource::collection($printers),
            'departmentsList' => DepartmentsResource::collection($departmentsList),
            // 'compNameList' => ComputersResource::collection($compNameList),
            'prntrUsersList' => AccountUsersResource::collection($printerUsersList),
            'printersAllData' => PrintersResource::collection($printersAllData),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    public function printAssetTag($assetId) {
        // Find the full asset record by ID
        $asset = Printers::findOrFail($assetId);
    
        try {
            // Load the Excel template
            $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load(resource_path('js/Components/hooks/Asset Tag Format.xlsx'));
        } catch (\Exception $e) {
            return back()->with('error', 'Asset tag template not found.');
        }
    
        // Get the active sheet
        $sheet = $spreadsheet->getActiveSheet();
    
        // Populate the Excel template with data from the asset
        $sheet->setCellValue('F7',($asset->printer_asset ?? ''));
        $sheet->setCellValue('C10',($asset->printer_model ?? ''));
        $sheet->setCellValue('C12',($asset->printer_model ?? ''));
        $sheet->setCellValue('C14',($asset->printer_serial ?? ''));
        // Format datePurchased to 'm/d/y' (e.g., 4/25/2024)
        $datePurchased = $asset->datePurchased ? Carbon::parse($asset->datePurchased)->format('m/d/Y') : '';
        $sheet->setCellValue('G8', $datePurchased);
        $sheet->setCellValue('G10',($asset->printer_department ?? ''));
        $sheet->setCellValue('G11', 'Issued To: ' . ($asset->printer_user ?? ''));
    
        // Save the file to a temporary location
        $fileName = 'asset_tag_' . uniqid() . '.xlsx';
        $tempFile = sys_get_temp_dir() . '/' . $fileName;
        
        $writer = new Xlsx($spreadsheet);
        $writer->save($tempFile);
    
        // Download the file and delete it after sending
        return response()->download($tempFile)->deleteFileAfterSend(true);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return inertia("Printers/Create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePrintersRequest $request)
    {
        //
        $data = $request->validated();
        /** @var $img_path \Illuminate\Http\UploadedFile */
        $img_path = $data['img_path'] ?? null;
        $data['created_by'] = Auth::id(); 
        $data['updated_by'] = Auth::id();
        if($img_path){
            $data['img_path'] = $img_path->store('Printers/'.Str::random(), 'public');
        }

        //?Checking if there's a data is posted after submission 
        // dd($data);

        //*This is for passing the data to create a new monitor
        Printers::create($data);

        return to_route('printers.index')->with('success', 'New printer was created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Printers $printers)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Printers $printers)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePrintersRequest $request, Printers $printer)
    {
        //
        $data = $request->validated();
        // \Log::info('Update data: ', $data);

        // Handle img_path if it exists
        $img_path = $request->file('img_path');

        if($img_path){
            if($printer->img_path){
                Storage::disk('public')->deleteDirectory(dirname($printer->img_path));
            }
            $data['img_path'] = $img_path->store('Printers/'.Str::random(), 'public');
        } else {
            unset($data['img_path']);
        }

        $data['updated_by'] = Auth::id();
        $printer->update($data);
        // \Log::info('Updated printer: ', $printers->toArray());
        return to_route('printers.index')->with('success', "Printer \" $printer->printer_model\" was updated");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Printers $printer)
    {
        //
        $printer->delete();
        if($printer->img_path){
            Storage::disk('public')->deleteDirectory(dirname($printer->img_path));
        }
        return to_route('printers.index')->with('success', "Printer - \" $printer->printer_user\" successfully deleted!");
    }
    public function bulkFetch(Request $request)
    {
        $ids = $request->input('ids');
        $printer = Printers::whereIn('printer_id', $ids)->get();
        return response()->json($printer);
    }
}
