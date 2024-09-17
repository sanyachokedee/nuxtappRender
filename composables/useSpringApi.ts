import type { Product, ProductList } from "@/types/product"
import type { CategoryList } from "@/types/category"
   

export default() => {

 // Import SweetAlert2
    const { $swal } : any = useNuxtApp()

    const router = useRouter()

    const config = useRuntimeConfig()
    const SPRING_API = config.public.url

    // อ่าน token จาก cookie
    const token = useCookie('token')

    // กำหนด header สำหรับการเรียก api
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`
    }

    // กำหนด header สำหรับการเรียก api ที่รับ form data
    const headersFormData = {
        'Authorization': `Bearer ${token.value}`
    }

    // function สำหรับดึงข้อมูล product และเช็คว่ามี token หรือไม่
    const fetchWithTokenCheck = async <T>(url: string, options: object) => {
     //start
        try {
            
       
        const response = await useFetch<T>(url, options)
        console.log('line33  response.error.value=',response.error.value)
        console.log('line33  rresponse.error.value.statusCode= ดูจาก error.value.stauscode')
        if(response.error.value && response.error.value.statusCode === 403){
            // หาก token หมดอายุหรือไม่ถูกต้องให้ redirect ไปหน้า login
            $swal.fire({
                title: 'You did not have permission',
                text: 'No access to the system',
                icon: 'error',
                confirmButtonText: 'OK'
            })
            // ให้โยนไปหน้าแรก "  / "
            // router.push('/')   //ไปหน้า index ถ้ามี login ให้ไป login
            router.push('/backend/dashboard')
            console.log('line45')
        }

        return response

        //end
    } catch (error) {
        console.log('error line35=',error)
    }
    }

    // function อ่านหมวดหมู่สินค้าทั้งหมด
    const getAllCategories = async() => {
        return fetchWithTokenCheck<CategoryList>(
            `${SPRING_API}/categories`,
            {
                method: 'GET',
                headers: headers,
                cache: 'no-cache'
            }
        )
    }

    // function สำหรับดึงข้อมูล product ทั้งหมด
    const getAllProducts = async(
        page: number, 
        limit: number,
        searchQuery: string= "",
        selectedCategory: number | null = null
    ) => {

        // สร้าง  URL Parameters ตามค่าที่ได้รับ
        let url = `${SPRING_API}/products?page=${page}&limit=${limit}`

        // ถ้ามีการค้นหา
        if(searchQuery) {
            url += `&searchQuery=${encodeURIComponent(searchQuery)}`
        }

        if(selectedCategory !== null) {
            url += `&selectedCategory=${selectedCategory}`
        }

        return fetchWithTokenCheck<ProductList>(url,
            {
                method: 'GET',
                headers: headers,
                cache: 'no-cache'
            }
        )
    }

    // function อ่านข้อมูล product ตาม id
    const getProductById = async(id: number) => {
        return fetchWithTokenCheck<Product>(
            `${SPRING_API}/products/${id}`,
            {
                method: 'GET',
                headers: headers,
                cache: 'no-cache'
            }
        )
    }

    // function สำหรับเพิ่มข้อมูล product
    const createProduct = async(product: FormData) => {
        return useFetch(`${SPRING_API}/products`,{
            method: 'POST',
                body: product,
                headers: headersFormData,
                cache: 'no-cache',
            }
        )
    }

    // function สำหรับอัพเดทข้อมูล product
    const updateProduct = async(id: number, product: FormData) => {
        return useFetch(`${SPRING_API}/products/${id}`,{
            method: 'PUT',
                body: product,
                headers: headersFormData,
                cache: 'no-cache',
            }
        )
    }

    // function สำหรับลบข้อมูล product
    const deleteProduct = async(id: number) => {
        return useFetch(`${SPRING_API}/products/${id}`,{
            method: 'DELETE',
                headers: headers,
                cache: 'no-cache',
            }
        )
    }
    
    return {
        getAllProducts,
        getAllCategories,
        createProduct,
        getProductById,
        updateProduct,
        deleteProduct
    }
}