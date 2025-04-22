import { useEffect } from "react";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Switch from "@/components/form/switch/Switch";

interface Props {
  data: any;
  onChange: (newData: any) => void;
}

// ✅ دالة استخراج الإحداثيات من روابط Google Maps
const extractLatLng = (url: string): { lat: string; lng: string } | null => {
  const match =
    url.match(/@(-?\d{1,3}\.\d+),\s*(-?\d{1,3}\.\d+)/) || // https://maps/@lat,lng
    url.match(/([-+]?\d{1,3}\.\d+),\s*([-+]?\d{1,3}\.\d+)/); // https://maps/place/ or ?q=lat,lng

  if (match) {
    return {
      lat: match[1],
      lng: match[2],
    };
  }

  return null;
};

const StepBuilding = ({ data, onChange }: Props) => {
  useEffect(() => {
    const coords = extractLatLng(data.buildingMakaniMap || "");
    if (coords) {
      onChange((prev: any) => ({
        ...prev,
        buildingLatitude: coords.lat,
        buildingLongitude: coords.lng,
      }));
    }
  }, [data.buildingMakaniMap]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          name="buildingAddress"
          value={data.buildingAddress}
          onChange={(e) =>
            onChange((prev: any) => ({
              ...prev,
              buildingAddress: e.target.value,
            }))
          }
          placeholder="Building Address"
        />

        <Select
          options={[
            { value: "1", label: "Apartment" },
            { value: "2", label: "Villa" },
            { value: "3", label: "Office" },
            { value: "4", label: "Shop" },
            { value: "99", label: "Other" },
          ]}
          placeholder="Type of Unit"
          onChange={(value) =>
            onChange((prev: any) => ({
              ...prev,
              buildingTypeOfUnit: parseInt(value), // ✅ تحويل القيمة إلى رقم
            }))
          }
          value={data.buildingTypeOfUnit?.toString() || ""}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Select
          options={[
            { value: "1", label: "New" },
            { value: "2", label: "Used" },
            { value: "3", label: "Needs Renovation" },
            { value: "99", label: "Unknown" },
          ]}
          placeholder="Condition"
          onChange={(value) =>
            onChange((prev: any) => ({
              ...prev,
              buildingCondition: parseInt(value), // ✅ تحويل القيمة إلى رقم
            }))
          }
          value={data.buildingCondition?.toString() || ""}
        />

        <Input
          name="buildingFloor"
          value={data.buildingFloor}
          onChange={(e) =>
            onChange((prev: any) => ({
              ...prev,
              buildingFloor: e.target.value,
            }))
          }
          placeholder="Floor"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Switch
          label="Reconstruction"
          defaultChecked={data.buildingReconstruction || false}
          onChange={(val: boolean) =>
            onChange({ ...data, buildingReconstruction: val })
          }
        />
        <Switch
          label="Is Occupied"
          defaultChecked={data.isOccupied || false}
          onChange={(val: boolean) =>
            onChange({ ...data, isOccupied: val })
          }
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          name="buildingMakaniMap"
          value={data.buildingMakaniMap}
          onChange={(e) =>
            onChange((prev: any) => ({
              ...prev,
              buildingMakaniMap: e.target.value,
            }))
          }
          placeholder="Google Maps Location URL"
        />
        <Input
          name="buildingLatitude"
          value={data.buildingLatitude}
          onChange={(e) =>
            onChange((prev: any) => ({
              ...prev,
              buildingLatitude: e.target.value,
            }))
          }
          placeholder="Latitude"
        />
        <Input
          name="buildingLongitude"
          value={data.buildingLongitude}
          onChange={(e) =>
            onChange((prev: any) => ({
              ...prev,
              buildingLongitude: e.target.value,
            }))
          }
          placeholder="Longitude"
        />
      </div>
    </div>
  );
};

export default StepBuilding;
