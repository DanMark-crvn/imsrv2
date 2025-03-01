<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAccountManagementRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
            "equipmentName" => ['required', 'max:255'],
            // "department_users" => ['required', Rule::in($departments)],
            "managementIp" => ['required', 'max:255'],
            "username" => ['required', 'max:255'],
            "password" => ['required', 'max:255'],
        ];
    }
}
