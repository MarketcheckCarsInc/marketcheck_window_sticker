export interface EpiDecodeData {

}

export interface DealerApiResponse {
    num_found: string,
    dealers: DealerData[]
}

export interface DealerData {
    id: string,
    seller_name: string,
    inventory_url: string,
    data_source: string,
    status: string,
    dealer_type: string,
    street: string,
    city: string,
    state: string,
    country: string,
    zip: string,
    latitude: string,
    longitude: string,
    seller_phone: string
}